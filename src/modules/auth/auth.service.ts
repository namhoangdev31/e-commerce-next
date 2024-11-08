import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Req,
  UnauthorizedException,
  HttpStatus,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { AuthRepository } from '../../database/repositories/auth.repository'
import {
  DEFAULT_ROLE,
  EMAIL_ADMIN,
  INCORRECT_CREDENTIAL,
} from '../../shared/constants/strings.constants'
import { LoginResponse } from 'src/interfaces/login'
import { RefreshTokenDto } from './dto/refreshToken.dto'
import { MailService } from '../mail/mail.service'
import { RegisterInterface } from '../../interfaces/register.interface'
import * as requestIp from 'request-ip'
import { User } from '../../shared/decorators'
import { UsersDocument } from '../../database/schemas/users.schema'
import { Types } from 'mongoose'
import { LogoutResponse } from '../../interfaces/logout.interface'
import { InjectRepository } from '@nestjs/typeorm'
import { UsersEntities } from '../../database/entity/user.entity'
import { Repository } from 'typeorm'
import process from 'process'
import { ForgotPassDto, ResetPassDto } from '../users/dto/forgot-pass.dto'
import { PostMessageInterface } from '../../interfaces/post-message.interface'

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    @InjectRepository(UsersEntities)
    private usersSqlModel: Repository<UsersEntities>,
  ) {}

  async login(data: LoginDto, @Req() req: Request): Promise<PostMessageInterface> {
    const user = await this.authRepository.findByEmail(data.email)
    if (!user) {
      throw new BadRequestException(INCORRECT_CREDENTIAL)
    }

    const passwordMatched = await bcrypt.compare(data.password, user.passwordHash)
    if (!passwordMatched) {
      throw new BadRequestException(INCORRECT_CREDENTIAL)
    }

    const userCode = new Types.ObjectId(user._id)
    const clientIp = requestIp.getClientIp(req as any)

    const session = await this.createSession(user, req, clientIp)
    const role = await this.determineUserRole(user, userCode)

    const accessToken = this.generateAccessToken(user, session._id.toString(), role, session)
    const refreshToken = this.generateRefreshToken(user._id.toString(), session._id.toString())

    await this.authRepository.updateSessionToken(session._id, accessToken)

    return {
      statusCode: 200,
      data: {
        id: user._id,
        accessToken,
        refreshToken,
      },
      message: 'Login successful',
    }
  }

  async register(data: RegisterDto): Promise<PostMessageInterface> {
    let user, createUser
    try {
      user = await this.authRepository.create(data)
      createUser = await this.createSqlUser(data, user)

      if (!user) {
        throw new Error('Failed to create user in one of the databases')
      }

      await this.sendVerificationEmail(user)

      return {
        statusCode: 200,
        message: 'Registration successful! Please check your email to verify your account.',
      }
    } catch (e) {
      await this.rollbackRegistration(user, createUser)
      throw new InternalServerErrorException('Failed to process registration request')
    }
  }

  async changePassword(user: UsersDocument, dto: any): Promise<PostMessageInterface> {
    await this.validateCurrentPassword(user, dto.currentPassword)
    await this.updatePassword(user._id, dto.newPassword)
    return {
      statusCode: 200,
      message: 'Password changed successfully',
    }
  }

  async requestPasswordReset(dto: any): Promise<PostMessageInterface> {
    const user = await this.authRepository.findByEmail(dto.email)
    if (!user) {
      throw new BadRequestException('Email not found')
    }

    const resetToken = this.generateResetToken(String(user._id))
    await this.mailService.sendPasswordResetEmail(user, resetToken, 'reset-password')
    return {
      statusCode: 200,
      message: 'Password reset email sent',
    }
  }

  async resetPassword(token: string, dto: ForgotPassDto): Promise<PostMessageInterface> {
    const user = await this.validateResetToken(token)
    await this.updatePassword(user._id, dto.newPassWord)
    return {
      statusCode: 200,
      message: 'Password reset successful',
    }
  }

  async verifyEmail(token: string): Promise<PostMessageInterface> {
    const user = await this.validateVerificationToken(token)
    await this.authRepository.updateOne({ _id: user._id }, { isValidateEmail: true })
    return {
      statusCode: 200,
      message: 'Email verified successfully',
    }
  }

  async resendVerificationEmail(user: UsersDocument): Promise<PostMessageInterface> {
    if (user.isValidateEmail) {
      throw new BadRequestException('Email already verified')
    }

    await this.sendVerificationEmail(user)
    return {
      statusCode: 200,
      message: 'Verification email resent',
    }
  }

  async refreshToken(data: RefreshTokenDto): Promise<PostMessageInterface> {
    const user = await this.authRepository.refreshToken(data)
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token')
    }

    const session = await this.createRefreshSession(user)
    const accessToken = this.generateAccessToken(
      user,
      session._id.toString(),
      DEFAULT_ROLE,
      session,
    )
    const refreshToken = this.generateRefreshToken(String(user._id), session._id.toString())

    const updatedUser = await this.authRepository.saveRefresh(refreshToken, user._id)
    if (!updatedUser) {
      throw new BadRequestException('Failed to update refresh token')
    }

    return {
      statusCode: 200,
      data: {
        id: user._id,
        accessToken,
        refreshToken,
      },
      message: 'Token refreshed successfully',
    }
  }

  private generateAccessToken(
    user: any,
    sessionId?: string,
    role?: string,
    savedSession?: any,
  ): string {
    const payload = {
      user: {
        id: user._id,
        email: user.email,
        roleCode: role,
        firstName: user.firstName,
        lastName: user.lastName,
        isValidateEmail: user.isValidateEmail,
        session: this.createSessionPayload(user, sessionId, savedSession),
      },
    }

    return this.jwtService.sign(payload, {
      expiresIn: '30d',
      secret: process.env.JWT_SECRET,
      privateKey: process.env.KID,
    })
  }

  private generateRefreshToken(userCode: string, sessionId: string): string {
    return this.jwtService.sign(
      { userCode, sessionId },
      { expiresIn: '90d', secret: process.env.JWT_SECRET },
    )
  }

  private generateResetToken(userCode: string): string {
    return this.jwtService.sign({ userCode }, { expiresIn: '1h', secret: process.env.JWT_SECRET })
  }

  private generateVerificationToken(userCode: string): string {
    return this.jwtService.sign({ userCode }, { expiresIn: '24h', secret: process.env.JWT_SECRET })
  }

  async logout(@User() user: UsersDocument, @Req() req: Request): Promise<PostMessageInterface> {
    try {
      const deleteResult = await this.authRepository.deleteManySessions({
        userCode: new Types.ObjectId(user._id),
      })

      if (!deleteResult?.deletedCount) {
        throw new Error('Failed to delete user sessions')
      }

      return {
        statusCode: 200,
        message: 'Logout successful',
      }
    } catch (error) {
      throw new UnauthorizedException('Failed to logout. Please try again.')
    }
  }

  // Helper methods
  private async createSession(user: any, req: Request, clientIp: string) {
    const session = {
      userCode: String(user._id),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      userAgent: req.headers['user-agent'],
      ipAddress: clientIp,
      isRevoked: false,
      token: '',
      isOnline: true,
      lastActiveAt: new Date(),
    }

    await this.authRepository.deleteManySessions({ userCode: session.userCode })

    const savedSession = await this.authRepository.saveSession(session)
    if (!savedSession) {
      throw new UnauthorizedException('Failed to create session')
    }

    return savedSession
  }

  private async determineUserRole(user: any, userCode: Types.ObjectId): Promise<string> {
    if (user.email === EMAIL_ADMIN) {
      return DEFAULT_ROLE
    }

    const findRoleInUser = await this.authRepository.findUsersRoles({ userCode })
    if (findRoleInUser) {
      const findRole = await this.authRepository.findRolesFilter({
        _id: new Types.ObjectId(findRoleInUser.roleCode),
      })
      return findRole.roleName
    }

    return DEFAULT_ROLE
  }

  private async createSqlUser(data: RegisterDto, user: any) {
    const findUser = await this.usersSqlModel
      .createQueryBuilder('users')
      .where('email = :email', { email: data.email })
      .getOne()

    if (!findUser) {
      return this.usersSqlModel.save({
        ...data,
        passwordHash: user.passwordHash,
        userCode: String(user._id),
        isValidateEmail: false,
      })
    }
  }

  private async sendVerificationEmail(user: any) {
    const verificationToken = this.generateVerificationToken(String(user._id))
    await this.mailService.sendVerificationEmail(user, verificationToken)
  }

  private async rollbackRegistration(user: any, createUser: any) {
    if (user || createUser) {
      await Promise.all([
        user && this.authRepository.deleteById(user._id),
        createUser && this.usersSqlModel.delete({ id: createUser.id }),
      ])
    }
  }

  private async validateCurrentPassword(user: UsersDocument, currentPassword: string) {
    const isValid = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!isValid) {
      throw new BadRequestException('Current password is incorrect')
    }
  }

  private async updatePassword(userCode: any, newPassword: string) {
    const passwordHash = await bcrypt.hash(newPassword, 10)
    await this.authRepository.updateOne({ _id: userCode }, { passwordHash })
  }

  private async validateResetToken(token: string) {
    const payload = this.jwtService.verify(token)
    const user = await this.authRepository.findById(payload.userCode)
    if (!user) {
      throw new BadRequestException('Invalid reset token')
    }
    return user
  }

  private async validateVerificationToken(token: string) {
    const payload = this.jwtService.verify(token)
    const user = await this.authRepository.findById(payload.userCode)
    if (!user) {
      throw new BadRequestException('Invalid verification token')
    }
    return user
  }

  private async createRefreshSession(user: any) {
    const session = {
      userCode: String(user._id),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isRevoked: false,
      token: '',
      isOnline: true,
      lastActiveAt: new Date(),
    }

    return this.authRepository.saveSession({
      ...session,
      userAgent: '',
      ipAddress: '',
    })
  }

  private createSessionPayload(user: any, sessionId?: string, savedSession?: any) {
    if (!sessionId && !savedSession) return null

    return {
      sessionId,
      userCode: user._id,
      expiresAt: savedSession.expiresAt,
      userAgent: savedSession.userAgent,
      ipAddress: savedSession.ipAddress,
      isRevoked: savedSession.isRevoked,
      lastActiveAt: savedSession.lastActiveAt,
      isOnline: savedSession.isOnline,
    }
  }
}
