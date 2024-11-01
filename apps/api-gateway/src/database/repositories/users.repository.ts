import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User, UserDocument } from '../schemas/user.schema'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { UsersEntities } from '../entity/user.entity'
import { Users, UsersDocument } from '../schemas/users.schema'

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(Users.name)
    private userModel: Model<UsersDocument>,
    @InjectRepository(UsersEntities)
    private userEntity: Repository<UsersEntities>,
  ) {}

  async syncUsersFromMySQLToMongoDB(): Promise<void> {
    const mysqlUsers = await this.userEntity.find()
    const existingUsers = await this.userModel.find({
      email: { $in: mysqlUsers.map(user => user.email) },
    })

    const existingEmails = existingUsers.map(user => user.email)
    const newUsers = mysqlUsers.filter(user => !existingEmails.includes(user.email))

    if (newUsers.length > 0) {
      await this.userModel.insertMany(
        newUsers.map(user => ({
          username: user.username,
          email: user.email,
          passwordHash: user.passwordHash,
          firstName: user.firstName,
          lastName: user.lastName,
          profilePictureUrl: user.profilePictureUrl,
          isValidateEmail: user.isValidateEmail,
          roleCode: user.roleCode,
        })),
      )
    }
  }
}
