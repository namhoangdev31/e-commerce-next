import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Req,
  UnauthorizedException,
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
  SUPER_ADMIN,
} from '../../shared/constants/strings.constants'
import { LoginResponse } from 'src/interfaces/login'
import { RefreshTokenDto } from './dto/refreshToken.dto'
import process from 'process'
import { MailService } from '../mail/mail.service'
import { RegisterInterface } from '../../interfaces/register.interface'
import * as requestIp from 'request-ip'
import { UserStatus } from '../../database/schemas/user-online.schema'
import { User } from '../../shared/decorators'
import { UsersDocument } from '../../database/schemas/users.schema'
import { Types } from 'mongoose'
import { LogoutResponse } from '../../interfaces/logout.interface'
import { OtpDto } from './dto/otp.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { UsersEntities } from '../../database/entity/user.entity'
import { Repository } from 'typeorm'

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    @InjectRepository(UsersEntities)
    private usersSqlModel: Repository<UsersEntities>,
  ) {}

  async login(data: LoginDto, @Req() req: Request): Promise<LoginResponse> {
    const user = await this.authRepository.findByEmail(data.email)
    if (!user) {
      throw new BadRequestException(INCORRECT_CREDENTIAL)
    }

    const passwordMatched = await bcrypt.compare(data.password, user.passwordHash)
    if (!passwordMatched) {
      throw new BadRequestException(INCORRECT_CREDENTIAL)
    }

    const userId = new Types.ObjectId(user._id)
    const clientIp = requestIp.getClientIp(req as any)

    const session = {
      userId: user._id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      userAgent: req.headers['user-agent'],
      ipAddress: clientIp,
      isRevoked: false,
      token: '',
      isOnline: true,
      lastActiveAt: new Date(),
    }

    await this.authRepository.deleteManySessions({ userId })

    const savedSession = await this.authRepository.saveSession(session)
    if (!savedSession) {
      throw new UnauthorizedException('Failed to create session')
    }

    let role = user.email === EMAIL_ADMIN ? SUPER_ADMIN : DEFAULT_ROLE

    if (user.email !== EMAIL_ADMIN) {
      const findRoleInUser = await this.authRepository.findUsersRoles({ userId })
      if (findRoleInUser) {
        const findRole = await this.authRepository.findRolesFilter({
          roleCode: findRoleInUser.roleCode,
        })
        role = findRole.roleCode
      }
    }

    const accessToken = this.generateAccessToken(
      user,
      savedSession._id.toString(),
      role,
      savedSession,
    )
    const refreshToken = this.generateRefreshToken(user._id.toString(), savedSession._id.toString())

    await this.authRepository.updateSessionToken(savedSession._id, accessToken)

    return {
      id: user._id,
      accessToken,
      refreshToken,
    }
  }

  async register(data: RegisterDto): Promise<RegisterInterface> {
    let user, createUser
    try {
      const user = await this.authRepository.create(data)
      const findUser = await this.usersSqlModel
        .createQueryBuilder('users')
        .where('email = :email', { email: data.email })
        .getOne()

      if (!findUser) {
        createUser = await this.usersSqlModel.save({
          ...data,
          passwordHash: user.passwordHash,
          isValidateEmail: false,
        })
      }

      if (!user) {
        throw new Error('Failed to create user in one of the databases')
      }

      const otp = this.generateOTP()
      await Promise.all([
        this.authRepository.saveOtp(user, otp),
        this.mailService.sendUserOTP(user, otp),
      ])

      return {
        accessToken: this.generateAccessToken(user),
        message: 'Registration successful! Please check your email to validate your account.',
      }
    } catch (e) {
      console.error('Error during registration: ', e)
      await Promise.all([
        user && this.authRepository.deleteById(user._id),
        createUser && this.usersSqlModel.delete({ id: createUser.id }),
      ])
      throw new InternalServerErrorException(
        `${e.toString().split(': ')[1]}`,
        'Failed to process registration request',
      )
    }
  }

  async refreshToken(data: RefreshTokenDto): Promise<LoginResponse> {
    const user = await this.authRepository.refreshToken(data)

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token')
    }

    const accessToken = this.generateAccessToken(user)
    const refreshToken = this.generateRefreshToken(user._id)

    const updatedUser = await this.authRepository.saveRefresh(refreshToken, user._id)
    if (!updatedUser) {
      throw new BadRequestException('Failed to update refresh token')
    }

    return {
      id: user._id,
      accessToken,
      refreshToken,
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
        session: {
          sessionId,
          userId: user._id,
          expiresAt: savedSession.expiresAt,
          userAgent: savedSession.userAgent,
          ipAddress: savedSession.ipAddress,
          isRevoked: savedSession.isRevoked,
          lastActiveAt: savedSession.lastActiveAt,
          isOnline: savedSession.isOnline,
        },
      },
    }

    return this.jwtService.sign(payload, {
      expiresIn: '30d',
      secret: process.env.JWT_SECRET,
    })
  }

  private generateRefreshToken(userId: any, sessionId?: string): string {
    return this.jwtService.sign(
      { userId, sessionId },
      { expiresIn: '90d', secret: process.env.JWT_SECRET },
    )
  }

  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  async logout(@User() user: UsersDocument, @Req() req: Request): Promise<LogoutResponse> {
    try {
      const deleteResult = await this.authRepository.deleteManySessions({
        userId: new Types.ObjectId(user._id),
      })

      if (!deleteResult || deleteResult.deletedCount === 0) {
        throw new Error('Failed to delete user sessions')
      }

      return {
        message: 'Logout successful',
      }
    } catch (error) {
      console.error('Logout error:', error)
      throw new UnauthorizedException('Failed to logout. Please try again.')
    }
  }

  async sendRequestOtp(user: UsersDocument): Promise<{ message: string; statusCode: number }> {
    const otp = this.generateOTP()
    await this.authRepository.saveOtp(user, otp)
    await this.mailService.sendUserOTP(user, otp)
    return {
      message: 'OTP sent successfully',
      statusCode: 200,
    }
  }
}
