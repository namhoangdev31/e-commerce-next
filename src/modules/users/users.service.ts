import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { OtpDto } from '../auth/dto/otp.dto'
import { UsersDocument } from '../../database/schemas/users.schema'
import { AuthRepository } from '../../database/repositories/auth.repository'
import { JwtService } from '@nestjs/jwt'
import { MailService } from '../mail/mail.service'
import { ForgotPassDto, ResetPassDto } from './dto/forgot-pass.dto'
import { User } from '../../shared/decorators'
import * as bcrypt from 'bcrypt'
import { ResetPassInterface } from '../../interfaces/reset-pass.interface'

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: AuthRepository,
    private readonly mailService: MailService,
  ) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user'
  }

  findAll() {
    return `This action returns all users`
  }

  findOne(id: number) {
    return `This action returns a #${id} user`
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`
  }

  remove(id: number) {
    return `This action removes a #${id} user`
  }

  async forgotPassword(data: ForgotPassDto, user: UsersDocument): Promise<void> {
    const checkUser = await this.userRepository.findById(user._id.toString())

    if (!checkUser) {
      throw new BadRequestException('User not found')
    }

    if (checkUser.email !== data.email) {
      throw new BadRequestException('Email does not match')
    }

    const isPasswordValid = await bcrypt.compare(data.currentPassWord, checkUser.passwordHash)
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid current password')
    }

    const newPasswordHash = await bcrypt.hash(data.newPassWord, 10)

    const updated = await this.userRepository.updateOne(
      { _id: user._id },
      { passwordHash: newPasswordHash },
    )

    if (!updated) {
      throw new InternalServerErrorException('Failed to update password')
    }
  }

  async resetPassword(data: ResetPassDto): Promise<ResetPassInterface> {
    const checkUser = await this.userRepository.findByEmail(data.email)
    if (!checkUser) {
      throw new NotFoundException('User not found')
    }

    const randomPassword = this.generateRandomPassword()
    const hashedPassword = await bcrypt.hash(randomPassword, 10)
    const otp = this.generateOTP()
    const updated = await this.userRepository.updateOne(
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
