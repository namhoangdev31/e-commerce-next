import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import * as bcrypt from 'bcrypt'
import { RegisterDto } from '../../modules/auth/dto/register.dto'
import { DUPLICATED_EMAIL } from '../../shared/constants/strings.constants'
import { Users, UsersDocument } from '../schemas/users.schema'
import { RefreshTokenDto } from '../../modules/auth/dto/refreshToken.dto'
import * as jwt from 'jsonwebtoken'
import process from 'process'

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(Users.name)
    private userModel: Model<UsersDocument>,
  ) {}

  public findById(id: string): Promise<UsersDocument> {
    return this.userModel.findById(id)
  }

  public findByEmail(email: string): Promise<UsersDocument> {
    return this.userModel.findOne({ email })
  }

  public saveRefresh(refreshToken: string, id: any): Promise<UsersDocument> {
    return this.userModel.findByIdAndUpdate(id, {
      refreshToken: refreshToken,
    })
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

  async parseJwt(token: string): Promise<any> {
    try {
      return jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
      throw new Error('Invalid token')
    }
  }
}
