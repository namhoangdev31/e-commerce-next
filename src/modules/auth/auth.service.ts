import { BadRequestException, Injectable, Req, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { AuthRepository } from '../../database/repositories/auth.repository'
import { INCORRECT_CREDENTIAL } from '../../shared/constants/strings.constants'
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

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async login(data: LoginDto, @Req() req: Request): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(data.email)
    if (!user) {
      throw new BadRequestException(INCORRECT_CREDENTIAL)
    }

    const passwordMatched = await bcrypt.compare(data.password, user.passwordHash)
    if (!passwordMatched) {
      throw new BadRequestException(INCORRECT_CREDENTIAL)
    }
    const clientIp = requestIp.getClientIp(req as any)
    const session = {
      userId: user._id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      userAgent: req.headers['user-agent'],
      ipAddress: clientIp,
      isRevoked: false,
      token: '',
    }
    const deleteOldSession = await this.userRepository.deleteManySessions({ userId: user._id })
    if (!deleteOldSession) {
      throw new BadRequestException()
    }
    const savedSession = await this.userRepository.saveSession({
      ...session,
      isOnline: true,
      lastActiveAt: new Date(),
    })

    if (!savedSession) {
      throw new UnauthorizedException('Failed to create session')
    }

    const accessToken = this.generateAccessToken(user, savedSession._id.toString())
    const refreshToken = this.generateRefreshToken(user._id.toString(), savedSession._id.toString())

    await this.userRepository.updateSessionToken(savedSession._id, accessToken)

    return {
      id: user._id,
      accessToken,
      refreshToken,
    }
  }

  async register(data: RegisterDto): Promise<RegisterInterface> {
    const user = await this.userRepository.create(data)
    if (user) {
      try {
        const otp = this.generateOTP()
        await this.userRepository.saveOtp(user, otp)
        const isSendMail = await this.mailService.sendUserOTP(user, otp)
        if (!isSendMail) {
          throw new BadRequestException('Failed to send OTP email')
        }
      } catch (e) {
        console.error('Error sending OTP: ', e)
        throw new BadRequestException('Failed to process OTP request')
      }
    }

    return {
      accessToken: this.generateAccessToken(user),
      message: 'Registration successful! Please check your email to validate your account.',
    }
  }

  async reGenAccessToken(data: RefreshTokenDto): Promise<LoginResponse> {
    const user = await this.userRepository.refreshToken(data)
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token')
    }

    const accessToken = this.generateAccessToken(user)
    const refreshToken = this.generateRefreshToken(user._id)

    const updatedUser = await this.userRepository.saveRefresh(refreshToken, user._id)
    if (!updatedUser) {
      throw new BadRequestException('Failed to update refresh token')
    }

    return {
      id: user._id,
      accessToken,
      refreshToken,
    }
  }

  private generateAccessToken(user: any, sessionId?: string): string {
    const payload = {
      userId: user._id,
      sessionId,
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isValidateEmail: user.isValidateEmail,
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
      const deleteResult = await this.userRepository.deleteManySessions({
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

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email)
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findByToken(token)
  }

  async verifyEmail(otp: OtpDto, user: UsersDocument): Promise<void> {
    const result = await this.userRepository.findByFilter({
      _id: user._id,
      otpConfirm: otp.otpContent,
    })

    if (!result) {
      throw new BadRequestException('Mã OTP không hợp lệ hoặc đã hết hạn')
    }

    await this.userRepository.updateOne(
      { _id: user._id },
      { $set: { isValidateEmail: true }, $unset: { otpConfirm: 1 } },
    )
  }

  async changePassword(
    user: UsersDocument,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    const foundUser = await this.userRepository.findByEmail(user.email)
  }
}
