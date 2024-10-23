import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import * as bcrypt from 'bcrypt'
import { RegisterDto } from '../../modules/auth/dto/register.dto'
import { DUPLICATED_EMAIL } from '../../shared/constants/strings.constants'
import { Users, UsersDocument } from '../schemas/users.schema'
import { RefreshTokenDto } from '../../modules/auth/dto/refreshToken.dto'
import { UserSession, UserSessionDocument } from '../schemas/user-session.schema'
import { UserOnline, UserOnlineDocument, UserStatus } from '../schemas/user-online.schema'

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(Users.name)
    private userModel: Model<UsersDocument>,
    @InjectModel(UserSession.name)
    private userSessionModel: Model<UserSessionDocument>,
  ) {}

  public findById(id: string): Promise<UsersDocument> {
    return this.userModel.findById(id)
  }

  public findByEmail(email: string): Promise<UsersDocument> {
    return this.userModel.findOne({ email })
  }

  public findByFilter(filter: any): Promise<UsersDocument> {
    return this.userModel.findOne(filter)
  }

  public async saveSession(session: UserSession): Promise<UserSessionDocument> {
    return this.userSessionModel.create(session)
  }

  public async saveRefresh(refreshToken: string, id: any): Promise<UsersDocument> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, {
      refreshToken: refreshToken,
    })

    if (!updatedUser) {
      throw new BadRequestException('User not found or update failed')
    }

    return updatedUser
  }

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

  public async refreshToken(data: RefreshTokenDto): Promise<UsersDocument> {
    const user = await this.userModel.findOne({
      refreshToken: data.refreshToken,
      _id: data.userId,
    })
    return user
  }

  public async saveOtp(user: UsersDocument, otp: string): Promise<UsersDocument> {
    return this.userModel.findByIdAndUpdate(user._id, {
      otpConfirm: otp,
      timeUpdateOtp: new Date(),
    })
  }

  public async updateSessionToken(sessionId: any, token: string): Promise<UserSessionDocument> {
    return this.userSessionModel.findByIdAndUpdate(sessionId, { token })
  }

  public async findValidSession(
    sessionId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<UserSessionDocument | null> {
    return this.userSessionModel.findOne({
      _id: sessionId,
      userId: userId,
    })
  }

  public async deleteManySessions(filter: any): Promise<any> {
    return this.userSessionModel.deleteMany(filter)
  }

  public async findAllSession(): Promise<UserSessionDocument[]> {
    return this.userSessionModel.find().exec()
  }

  public async updateSession(filter: any, update: any): Promise<any> {
    return this.userSessionModel.updateOne(filter, update)
  }

  public async findByToken(token: string): Promise<UsersDocument> {
    return this.userModel.findOne({ resetPasswordToken: token })
  }

  public async updateResetPasswordToken(
    token: string,
    userId: Types.ObjectId,
  ): Promise<UsersDocument> {
    return this.userModel.findByIdAndUpdate(userId, { resetPasswordToken: token })
  }

  public async updateOne(filter: any, update: any): Promise<UsersDocument> {
    return this.userModel.findOneAndUpdate(filter, update, { new: true })
  }
}
