import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { UsersEntities } from '../entity/user.entity'
import { Users, UsersDocument } from '../schemas/users.schema'
import { RolesRepository } from './roles.repository'
import { UserRoles, UserRolesDocument } from '../schemas/user-roles.schema'
import { UserRolesEntity } from '../entity/user-roles.entity'
import { RoleEntity } from '../entity/role.entity'

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(Users.name)
    private userModel: Model<UsersDocument>,
    @InjectModel(UserRoles.name)
    private userRoleModel: Model<UserRolesDocument>,
    @InjectRepository(UsersEntities)
    private userEntity: Repository<UsersEntities>,
    @InjectRepository(RoleEntity)
    private roleEntity: Repository<RoleEntity>,
    @InjectRepository(UserRolesEntity)
    private userRolesEntity: Repository<UserRolesEntity>,
    private readonly rolesRepository: RolesRepository,
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

  async assignRolesToUser(userCode: string, roleCode: string, user: UsersDocument): Promise<any> {
    try {
      const findRole = await this.rolesRepository.findRoleByCode(roleCode)

      const findUser = await this.userModel.findOne({
        _id: new Types.ObjectId(userCode),
      })

      if (!findRole || !findUser) {
        throw new BadRequestException('Error not found')
      }

      const findRoleId = await this.roleEntity
        .createQueryBuilder('roles')
        .where('roles.role_code = :roleCode', { roleCode })
        .getOne()

      const findUserCode = await this.userEntity
        .createQueryBuilder('users')
        .where('users.user_code = :userCode', { userCode: userCode })
        .getOne()

      if (!findRoleId || !findUserCode) {
        throw new BadRequestException('Error not found')
      }

      const existingUserRole = await this.userRoleModel.findOne({
        userCode: userCode,
      })
      let userRole: any
      if (existingUserRole) {
        userRole = await this.userRoleModel.findOneAndUpdate(
          { userCode: userCode },
          { roleCode: roleCode, assignmentStartDate: new Date() },
          { new: true },
        )

        await this.userRolesEntity
          .createQueryBuilder()
          .update(UserRolesEntity)
          .set({
            roleCode: findRoleId.roleCode,
            assignmentStartDate: new Date(),
          })
          .where('userCode = :userCode', { userCode: findUserCode.userCode })
          .execute()
      } else {
        userRole = await this.userRoleModel.create({
          userCode: userCode,
          roleCode: roleCode,
          assignmentStartDate: new Date(),
        })

        // Insert into MySQL
        await this.userRolesEntity
          .createQueryBuilder()
          .insert()
          .into(UserRolesEntity)
          .values({
            userCode: findUserCode.userCode,
            roleCode: findRoleId.roleCode,
            assignmentStartDate: new Date(),
          })
          .execute()
      }

      if (!userRole) {
        throw new InternalServerErrorException('Failed to add/update role for user')
      }

      return {
        message: existingUserRole ? 'Update role successful!' : 'Add role successful!',
        status: 200,
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to add/update role for user')
    }
  }
}
