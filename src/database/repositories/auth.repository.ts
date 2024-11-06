/**
 * Repository class for handling authentication-related database operations
 * Manages user authentication, sessions, roles, and OTP functionality
 */
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose'
import * as bcrypt from 'bcrypt'
import { RegisterDto } from '../../modules/auth/dto/register.dto'
import { DUPLICATED_EMAIL } from '../../shared/constants/strings.constants'
import { Users, UsersDocument } from '../schemas/users.schema'
import { RefreshTokenDto } from '../../modules/auth/dto/refreshToken.dto'
import { UserSession, UserSessionDocument } from '../schemas/user-session.schema'
import { UsersEntities } from '../entity/user.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { UserRoles, UserRolesDocument } from '../schemas/user-roles.schema'
import { Roles, RolesDocument } from '../schemas/roles.schema'

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel(Users.name)
    private userModel: Model<UsersDocument>,
    @InjectModel(UserSession.name)
    private userSessionModel: Model<UserSessionDocument>,
    @InjectModel(UserRoles.name)
    private userRolesModel: Model<UserRolesDocument>,
    @InjectModel(Roles.name)
    private rolesModel: Model<RolesDocument>,
  ) {}

  /**
   * Finds a user by their ID
   * @param id User ID
   * @returns User document if found
   */
  public findById(id: any): Promise<UsersDocument> {
    return this.userModel.findById(id)
  }

  /**
   * Finds a user by their email address
   * @param email Email to search for
   * @returns User document if found
   */
  public findByEmail(email: string): Promise<UsersDocument> {
    return this.userModel.findOne({ email })
  }

  /**
   * Finds a user matching the provided filter criteria
   * @param filter Query filter object
   * @returns User document if found
   */
  public findByFilter(filter: any): Promise<UsersDocument> {
    return this.userModel.findOne(filter)
  }

  /**
   * Creates a new user session
   * @param session Session data to save
   * @returns Created session document
   */
  public async saveSession(session: UserSession): Promise<UserSessionDocument> {
    return this.userSessionModel.create(session)
  }

  /**
   * Saves refresh token for a user
   * @param refreshToken New refresh token
   * @param id User ID
   * @returns Updated user document
   * @throws BadRequestException if user not found
   */
  public async saveRefresh(refreshToken: string, id: any): Promise<UsersDocument> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, {
      refreshToken: refreshToken,
    })

    if (!updatedUser) {
      throw new BadRequestException('User not found or update failed')
    }

    return updatedUser
  }

  /**
   * Creates a new user account
   * @param data Registration data
   * @returns Created user document
   * @throws BadRequestException if email already exists
   */
  public async create(data: RegisterDto): Promise<UsersDocument> {
    const user = await this.findByEmail(data.email)
    if (user) {
      throw new BadRequestException(DUPLICATED_EMAIL)
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)
    return this.userModel.create({
      ...data,
      passwordHash: hashedPassword,
    })
  }

  /**
   * Validates refresh token for a user
   * @param data Refresh token data
   * @returns User document if token valid
   */
  public async refreshToken(data: RefreshTokenDto): Promise<UsersDocument> {
    let userCode = new Types.ObjectId(data.userCode)
    return this.userModel.findOne({
      refreshToken: data.refreshToken,
      _id: userCode,
    })
  }

  /**
   * Saves OTP for a user
   * @param user User document
   * @param otp OTP to save
   * @returns Updated user document
   */
  public async saveOtp(user: UsersDocument, otp: string): Promise<UsersDocument> {
    return this.userModel.findByIdAndUpdate(user._id, {
      otpConfirm: otp,
      timeUpdateOtp: new Date(),
    })
  }

  /**
   * Updates token for a session
   * @param sessionId Session ID
   * @param token New token
   * @returns Updated session document
   */
  public async updateSessionToken(sessionId: any, token: string): Promise<UserSessionDocument> {
    return this.userSessionModel.findByIdAndUpdate(sessionId, { token })
  }

  /**
   * Finds valid session for a user
   * @param sessionId Session ID
   * @param userCode User ID
   * @returns Session document if valid
   */
  public async findValidSession(
    sessionId: Types.ObjectId,
    userCode: Types.ObjectId,
  ): Promise<UserSessionDocument | null> {
    return this.userSessionModel.findOne({
      _id: sessionId,
      userCode: userCode,
    })
  }

  /**
   * Deletes multiple sessions matching filter
   * @param filter Query filter
   * @returns Deletion result
   */
  public async deleteManySessions(filter: any): Promise<any> {
    return this.userSessionModel.deleteMany(filter)
  }

  /**
   * Deletes a user's session
   * @param id User ID
   * @returns Deletion result
   */
  public async deleteSession(id: Types.ObjectId): Promise<any> {
    return this.userSessionModel.findOneAndDelete({ userCode: id })
  }

  /**
   * Updates a session
   * @param filter Query filter
   * @param update Update data
   * @returns Update result
   */
  public async updateSession(filter: any, update: any): Promise<any> {
    return this.userSessionModel.updateOne(filter, update)
  }

  /**
   * Finds user by reset password token
   * @param token Reset token
   * @returns User document if found
   */
  public async findByToken(token: string): Promise<UsersDocument> {
    return this.userModel.findOne({ resetPasswordToken: token })
  }

  /**
   * Updates reset password token for a user
   * @param token New token
   * @param userCode User ID
   * @returns Updated user document
   */
  public async updateResetPasswordToken(
    token: string,
    userCode: Types.ObjectId,
  ): Promise<UsersDocument> {
    return this.userModel.findByIdAndUpdate(userCode, { resetPasswordToken: token })
  }

  /**
   * Updates a user document
   * @param filter Query filter
   * @param update Update data
   * @returns Updated user document
   */
  public async updateOne(
    filter: FilterQuery<UsersDocument>,
    update: UpdateQuery<UsersDocument>,
  ): Promise<UsersDocument | null> {
    return this.userModel.findOneAndUpdate(filter, update, { new: true }).exec()
  }

  /**
   * Deletes a user by ID
   * @param id User ID
   * @returns Deleted user document
   */
  public async deleteById(id: string): Promise<UsersDocument | null> {
    return this.userModel.findByIdAndDelete(id).exec()
  }

  /**
   * Finds user roles
   * @param filter Query filter
   * @returns User roles document
   */
  public async findUsersRoles(filter: any): Promise<UserRolesDocument> {
    return this.userRolesModel.findOne(filter)
  }

  /**
   * Finds roles matching filter
   * @param filter Query filter
   * @returns Roles document
   */
  public async findRolesFilter(filter: any): Promise<RolesDocument> {
    return this.rolesModel.findOne(filter)
  }
}
