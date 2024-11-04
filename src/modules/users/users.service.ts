import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { OtpDto } from '../auth/dto/otp.dto'
import { UsersDocument } from '../../database/schemas/users.schema'
import { AuthRepository } from '../../database/repositories/auth.repository'
import { MailService } from '../mail/mail.service'
import { ForgotPassDto, ResetPassDto } from './dto/forgot-pass.dto'
import { User } from '../../shared/decorators'
import * as bcrypt from 'bcrypt'
import { ResetPassInterface } from '../../interfaces/reset-pass.interface'
import { Types } from 'mongoose'
import { InjectRepository } from '@nestjs/typeorm'
import { UsersEntities } from '../../database/entity/user.entity'
import { Repository } from 'typeorm'
import { ChangePassDto } from './dto/change-pass.dto'
import { UserNotFoundException } from '../../shared/exceptions/UserNotFoundException.exception'
import { UserDetailInterfaces } from '../../interfaces/user-detail.interfaces'
import { UsersRepository } from 'src/database/repositories/users.repository'

@Injectable()
export class UsersService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly mailService: MailService,
    @InjectRepository(UsersEntities)
    private usersSqlModel: Repository<UsersEntities>,
    private readonly usersRepository: UsersRepository,
  ) {}

  async forgotPassword(data: ForgotPassDto): Promise<void> {
    try {
      const checkUser = await this.authRepository.findByEmail(data.email)

      if (!checkUser) throw new BadRequestException('Email does not match')

      const isPasswordValid = await bcrypt.compare(data.currentPassWord, checkUser.passwordHash)
      if (!isPasswordValid) throw new BadRequestException('Invalid current password')

      const newPasswordHash = await bcrypt.hash(data.newPassWord, 10)

      const updated = await this.authRepository.updateOne(
        { _id: checkUser._id },
        { passwordHash: newPasswordHash },
      )

      if (!updated) throw new InternalServerErrorException('Failed to update password')
    } catch (e) {
      throw new InternalServerErrorException()
    }
  }

  async resetPassword(data: ResetPassDto): Promise<ResetPassInterface> {
    try {
      const checkUser = await this.authRepository.findByEmail(data.email)
      if (!checkUser) {
        throw new NotFoundException('User not found')
      }

      const randomPassword = this.generateRandomPassword()
      const hashedPassword = await bcrypt.hash(randomPassword, 10)
      const otp = this.generateOTP()
      const updated = await this.authRepository.updateOne(
        { _id: checkUser._id },
        { termPassword: hashedPassword, isValidateEmail: false, otpConfirm: otp },
      )

      await this.mailService.sendMailForReset(checkUser, otp, randomPassword)

      if (!updated) {
        throw new InternalServerErrorException('Failed to reset password')
      }

      return {
        message: 'Password has been reset. Check your email for OTP and term pass',
        status_code: HttpStatus.OK,
      }
    } catch (e) {
      throw new InternalServerErrorException()
    }
  }

  private generateRandomPassword(length: number = 12): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+'
    let password = ''
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length)
      password += charset[randomIndex]
    }
    return password
  }

  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  async verifyEmail(otp: OtpDto, user: UsersDocument): Promise<any> {
    try {
      const isOtpValid = await this.isOtpValid(otp, user)
      const userCode = new Types.ObjectId(user._id)
      if (!isOtpValid) throw new BadRequestException('OTP code is invalid!')

      if (await this.isEmailAlreadyValidated(user)) {
        throw new BadRequestException('Email is already validated!')
      }

      const sessionsDeleted = await this.authRepository.deleteSession(userCode)
      if (!sessionsDeleted) {
        throw new BadRequestException('No sessions found to delete')
      }

      const updateResult = await this.authRepository.updateOne(
        { _id: user._id },
        { $set: { isValidateEmail: true }, $unset: { otpConfirm: 1 } },
      )

      if (!updateResult) {
        throw new Error('Failed to update user')
      }

      await this.usersSqlModel
        .createQueryBuilder()
        .update(UsersEntities)
        .set({ isValidateEmail: true })
        .where('username like N":username"', { username: user.username })
        .execute()

      return {
        message: 'Verify email successfully! Please logout your account!',
        statusCode: HttpStatus.OK,
      }
    } catch (e) {
      throw new InternalServerErrorException()
    }
  }

  private async isOtpValid(otp: OtpDto, user: UsersDocument): Promise<boolean> {
    const result = await this.authRepository.findByFilter({
      _id: user._id,
      otpConfirm: otp.otpContent,
    })
    return !!result
  }

  private async isEmailAlreadyValidated(user: UsersDocument): Promise<boolean> {
    const userRecord = await this.authRepository.findByFilter({ _id: user._id })
    return userRecord?.isValidateEmail
  }

  async changePassword(user: UsersDocument, data: ChangePassDto): Promise<void> {
    try {
      const userCode = new Types.ObjectId(user._id)

      const findUser = await this.authRepository.findById(userCode)

      if (!findUser) throw new UserNotFoundException()

      const isPasswordValid = await bcrypt.compare(data.currentPassWord, findUser.passwordHash)

      if (!isPasswordValid) {
        throw new BadRequestException('Invalid current password')
      }

      const newPasswordHash = await bcrypt.hash(data.newPassWord, 10)

      const updated = await this.authRepository.updateOne(
        { _id: findUser._id },
        { passwordHash: newPasswordHash },
      )

      if (!updated) {
        throw new InternalServerErrorException('Failed to change password')
      }

      await this.usersSqlModel
        .createQueryBuilder()
        .update(UsersEntities)
        .set({ passwordHash: newPasswordHash })
        .where('username like N":username"', { username: findUser.username })
        .execute()
    } catch (e) {
      throw new InternalServerErrorException()
    }
  }

  async getDetailUser(): Promise<any> {
    let user
    user = await this.usersSqlModel.createQueryBuilder('users').getMany()
    return {
      user: user,
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

  async assignRolesToUser(userCode: string, roleCode: string, user: UsersDocument): Promise<any> {
    return this.usersRepository.assignRolesToUser(userCode, roleCode, user)
  }
}
