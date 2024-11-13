/**
 * Service class for managing user-related operations including:
 * - Authentication (password reset, email verification, OTP)
 * - User management (CRUD operations)
 * - Profile management
 *
 * This service handles:
 * - Password management (forgot/reset/change password)
 * - Email verification and OTP handling
 * - User CRUD operations
 * - User profile management
 * - Role assignment
 * - Activity tracking
 *
 * The service interacts with both MongoDB and MySQL databases through repositories:
 * - AuthRepository: For authentication related operations
 * - UsersRepository: For user management operations
 * - UsersSqlModel: For MySQL specific operations
 *
 * Key features:
 * - Secure password hashing using bcrypt
 * - Email notifications for password reset and OTP
 * - Session management
 * - Data synchronization between MongoDB and MySQL
 * - Role-based access control
 */
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { OtpDto } from '../auth/dto/otp.dto'
import { UsersDocument } from '../../database/schemas/users.schema'
import { AuthRepository } from '../../database/repositories/auth.repository'
import { MailService } from '../mail/mail.service'
import { ForgotPassDto, ResetPassDto } from './dto/forgot-pass.dto'
import * as bcrypt from 'bcrypt'
import { ResetPassInterface } from '../../interfaces/reset-pass.interface'
import { Types } from 'mongoose'
import { InjectRepository } from '@nestjs/typeorm'
import { UsersEntities } from '../../database/entity/user.entity'
import { Repository } from 'typeorm'
import { ChangePassDto } from './dto/change-pass.dto'
import { UserNotFoundException } from '../../shared/exceptions/UserNotFoundException.exception'
import { FilterUserDto } from './dto/filter-user.dto'
import { SearchUserDto } from './dto/search-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { PageSizeInterface } from '../../interfaces/page-size.interface'
import { GetListDto } from './dto/get-list.dto'
import { UsersRepository } from '../../database/repositories/users.repository'

@Injectable()
export class UsersService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly mailService: MailService,
    @InjectRepository(UsersEntities)
    private usersSqlModel: Repository<UsersEntities>,
    private readonly usersRepository: UsersRepository,
  ) {}

  /**
   * Handles forgot password functionality
   * @param data ForgotPassDto containing email and password info
   * @throws BadRequestException if email doesn't match or current password is invalid
   * @throws InternalServerErrorException if password update fails
   */
  async forgotPassword(data: ForgotPassDto): Promise<void> {
    try {
      const user = await this.authRepository.findByEmail(data.email)
      if (!user) {
        throw new BadRequestException('Email does not match')
      }

      const isValidPassword = await bcrypt.compare(data.currentPassWord, user.passwordHash)
      if (!isValidPassword) {
        throw new BadRequestException('Invalid current password')
      }

      const newPasswordHash = await bcrypt.hash(data.newPassWord, 10)
      const updated = await this.authRepository.updateOne(
        { _id: user._id },
        { passwordHash: newPasswordHash },
      )

      if (!updated) {
        throw new InternalServerErrorException('Failed to update password')
      }
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  /**
   * Resets user password and sends temporary credentials via email
   * @param data ResetPassDto containing email
   * @returns ResetPassInterface with status message
   * @throws NotFoundException if user not found
   * @throws InternalServerErrorException if reset fails
   */
  async resetPassword(data: ResetPassDto): Promise<ResetPassInterface> {
    try {
      const user = await this.authRepository.findByEmail(data.email)
      if (!user) {
        throw new NotFoundException('User not found')
      }

      const tempPassword = this.generateRandomPassword()
      const hashedPassword = await bcrypt.hash(tempPassword, 10)
      const otp = this.generateOTP()

      const updated = await this.authRepository.updateOne(
        { _id: user._id },
        { termPassword: hashedPassword, isValidateEmail: false, otpConfirm: otp },
      )

      await this.mailService.sendMailForReset(user, otp, tempPassword)

      if (!updated) {
        throw new InternalServerErrorException('Failed to reset password')
      }

      return {
        message: 'Password has been reset. Check your email for OTP and temporary password',
        status_code: HttpStatus.OK,
      }
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  /**
   * Changes user password after validating current password
   * Updates password in both MongoDB and MySQL
   * @param user Current user document
   * @param data ChangePassDto with current and new password
   * @throws UserNotFoundException if user not found
   * @throws BadRequestException if current password invalid
   * @throws InternalServerErrorException if password change fails
   */
  async changePassword(user: UsersDocument, data: ChangePassDto): Promise<void> {
    try {
      const userCode = new Types.ObjectId(user._id)
      const foundUser = await this.authRepository.findById(userCode)

      if (!foundUser) {
        throw new UserNotFoundException()
      }

      const isValidPassword = await bcrypt.compare(data.currentPassWord, foundUser.passwordHash)
      if (!isValidPassword) {
        throw new BadRequestException('Invalid current password')
      }

      const newPasswordHash = await bcrypt.hash(data.newPassWord, 10)

      const [mongoUpdated] = await Promise.all([
        this.authRepository.updateOne({ _id: foundUser._id }, { passwordHash: newPasswordHash }),
        this.usersSqlModel
          .createQueryBuilder()
          .update(UsersEntities)
          .set({ passwordHash: newPasswordHash })
          .where('username like N":username"', { username: foundUser.username })
          .execute(),
      ])

      if (!mongoUpdated) {
        throw new InternalServerErrorException('Failed to change password')
      }
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  /**
   * Verifies user email using OTP
   * Updates verification status in both MongoDB and MySQL
   * @param otp OTP provided by user
   * @param user Current user document
   * @returns Success message and status
   * @throws BadRequestException if OTP invalid or email already validated
   * @throws InternalServerErrorException if verification fails
   */
  async verifyEmail(otp: OtpDto, user: UsersDocument): Promise<any> {
    try {
      if (!(await this.isOtpValid(otp, user))) {
        throw new BadRequestException('Invalid OTP code')
      }

      if (await this.isEmailAlreadyValidated(user)) {
        throw new BadRequestException('Email already validated')
      }

      const userCode = new Types.ObjectId(user._id)
      await this.authRepository.deleteSession(userCode)

      const [mongoUpdated] = await Promise.all([
        this.authRepository.updateOne(
          { _id: user._id },
          { $set: { isValidateEmail: true }, $unset: { otpConfirm: 1 } },
        ),
        this.usersSqlModel
          .createQueryBuilder()
          .update(UsersEntities)
          .set({ isValidateEmail: true })
          .where('username like N":username"', { username: user.username })
          .execute(),
      ])

      if (!mongoUpdated) {
        throw new Error('Failed to update user')
      }

      return {
        message: 'Email verified successfully! Please log out and log back in.',
        statusCode: HttpStatus.OK,
      }
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  /**
   * Generates and sends new OTP to user's email
   * @param user Current user document
   * @returns Success message and status
   */
  async sendRequestOtp(user: UsersDocument): Promise<{ message: string; statusCode: number }> {
    const otp = this.generateOTP()
    await this.authRepository.saveOtp(user, otp)
    await this.mailService.sendUserOTP(user, otp)
    return {
      message: 'OTP sent successfully',
      statusCode: 200,
    }
  }

  /**
   * Retrieves paginated list of all users
   * @param data GetListDto containing pagination params
   * @returns PageSizeInterface with user list and metadata
   */
  async findAll(data: GetListDto): Promise<PageSizeInterface> {
    return this.usersRepository.findAll(data)
  }

  /**
   * Finds user by ID
   * @param userCode User ID
   * @returns User details
   */
  async findById(userCode: string) {
    return this.usersRepository.findById(userCode)
  }

  /**
   * Updates user information
   * @param userCode User ID
   * @param updateUserDto Updated user data
   * @returns Updated user
   */
  async update(userCode: string, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(userCode, updateUserDto)
  }

  /**
   * Deletes user
   * @param userCode User ID to delete
   * @param user Current user performing deletion
   * @returns Deletion result
   */
  async delete(userCode: string, user: UsersDocument) {
    return this.usersRepository.delete(userCode, user)
  }

  /**
   * Searches users based on criteria
   * @param searchParams Search parameters
   * @returns Matching users
   */
  async search(searchParams: SearchUserDto) {
    return this.usersRepository.search(searchParams)
  }

  /**
   * Filters users based on criteria
   * @param filterParams Filter parameters
   * @returns Filtered users
   */
  async filter(filterParams: FilterUserDto) {
    return this.usersRepository.filter(filterParams)
  }

  /**
   * Assigns roles to user
   * @param userCode User ID
   * @param roleCode Role ID to assign
   * @param user Current user performing assignment
   * @returns Assignment result
   */
  async assignRolesToUser(userCode: string, roleCode: string, user: UsersDocument): Promise<any> {
    return this.usersRepository.assignRolesToUser(userCode, roleCode, user)
  }

  /**
   * Gets detailed user information
   * @returns User details from SQL database
   */
  async getDetailUser(): Promise<any> {
    return {
      user: await this.usersSqlModel.createQueryBuilder('users').getMany(),
    }
  }

  /**
   * Updates user profile
   * @param userCode User ID
   * @param updateProfileDto Updated profile data
   * @returns Updated profile
   */
  async updateProfile(userCode: string, updateProfileDto: UpdateProfileDto) {
    return this.usersRepository.updateProfile(userCode, updateProfileDto)
  }

  /**
   * Gets user activity history
   * @param userCode User ID
   * @returns Activity history
   */
  async getActivity(userCode: string) {
    return this.usersRepository.getActivity(userCode)
  }

  /**
   * Gets user login history
   * @param userCode User ID
   * @returns Login history
   */
  async getLoginHistory(userCode: string) {
    return this.usersRepository.getLoginHistory(userCode)
  }

  /**
   * Gets history of changes made to user
   * @param userCode User ID
   * @returns Change history
   */
  async getChanges(userCode: string) {
    return this.usersRepository.getChanges(userCode)
  }

  // Helper Methods

  /**
   * Generates random password of specified length
   * @param length Password length (default 12)
   * @returns Random password string
   */
  private generateRandomPassword(length: number = 12): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+'
    return Array(length)
      .fill(0)
      .map(() => charset[Math.floor(Math.random() * charset.length)])
      .join('')
  }

  /**
   * Generates 6-digit OTP
   * @returns OTP string
   */
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  /**
   * Validates OTP for user
   * @param otp OTP to validate
   * @param user User document
   * @returns Boolean indicating if OTP is valid
   */
  private async isOtpValid(otp: OtpDto, user: UsersDocument): Promise<boolean> {
    const result = await this.authRepository.findByFilter({
      _id: user._id,
      otpConfirm: otp.otpContent,
    })
    return !!result
  }

  /**
   * Checks if user's email is already validated
   * @param user User document
   * @returns Boolean indicating if email is validated
   */
  private async isEmailAlreadyValidated(user: UsersDocument): Promise<boolean> {
    const userRecord = await this.authRepository.findByFilter({ _id: user._id })
    return userRecord?.isValidateEmail
  }
}
