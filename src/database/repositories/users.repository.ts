/**
 * Repository class for managing user-related database operations
 * Handles both MongoDB and MySQL operations for user data
 *
 * Key features:
 * - User CRUD operations (create, read, update, delete)
 * - Role management and assignment
 * - Data synchronization between MongoDB and MySQL
 * - Search and filtering capabilities
 * - Profile management
 * - Bulk operations support
 *
 * The repository interacts with:
 * - MongoDB collections: Users, UserRoles
 * - MySQL tables: UsersEntities, RoleEntity, UserRolesEntity
 *
 * Security features:
 * - Role-based access control
 * - Permission validation
 * - Error handling with appropriate exceptions
 *
 * Main operations:
 * - syncUsersFromMySQLToMongoDB: Syncs user data between databases
 * - assignRolesToUser: Manages role assignments
 * - CRUD operations: findAll, findById, update, delete
 * - Bulk operations: bulkUpdate, bulkDelete
 * - Search and filter: search, filter
 * - Profile management: updateProfile
 */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
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
import { UpdateUserDto } from 'src/modules/users/dto/update-user.dto'
import { SearchUserDto } from 'src/modules/users/dto/search-user.dto'
import { FilterUserDto } from 'src/modules/users/dto/filter-user.dto'
import { UpdateProfileDto } from 'src/modules/users/dto/update-profile.dto'
import { PageSizeInterface } from '../../interfaces/page-size.interface'
import { GetListDto } from '../../modules/users/dto/get-list.dto'
import { ADMIN_ROLE, SUPER_ADMIN } from '../../shared/constants/strings.constants'
import { PostMessageInterface } from '../../interfaces/post-message.interface'

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(Users.name)
    private readonly userModel: Model<UsersDocument>,
    @InjectModel(UserRoles.name)
    private readonly userRoleModel: Model<UserRolesDocument>,
    @InjectRepository(UsersEntities)
    private readonly userEntity: Repository<UsersEntities>,
    @InjectRepository(RoleEntity)
    private readonly roleEntity: Repository<RoleEntity>,
    @InjectRepository(UserRolesEntity)
    private readonly userRolesEntity: Repository<UserRolesEntity>,
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
      const [findRole, findUser, findroleCode, findUserCode] = await Promise.all([
        this.rolesRepository.findRoleByCode(roleCode),
        this.userModel.findById(new Types.ObjectId(userCode)),
        this.roleEntity
          .createQueryBuilder('roles')
          .where('roles.role_code = :roleCode', { roleCode })
          .getOne(),
        this.userEntity
          .createQueryBuilder('users')
          .where('users.user_code = :userCode', { userCode })
          .getOne(),
      ])

      if (!findRole || !findUser || !findroleCode || !findUserCode) {
        throw new BadRequestException('Required data not found')
      }

      const existingUserRole = await this.userRoleModel.findOne({ userCode })

      if (existingUserRole) {
        await Promise.all([
          this.userRoleModel.findOneAndUpdate(
            { userCode },
            { roleCode, assignmentStartDate: new Date() },
            { new: true },
          ),
          this.userRolesEntity
            .createQueryBuilder()
            .update(UserRolesEntity)
            .set({
              roleCode: findroleCode.roleCode,
              assignmentStartDate: new Date(),
            })
            .where('userCode = :userCode', { userCode: findUserCode.userCode })
            .execute(),
        ])
      } else {
        await Promise.all([
          this.userRoleModel.create({
            userCode,
            roleCode,
            assignmentStartDate: new Date(),
          }),
          this.userRolesEntity
            .createQueryBuilder()
            .insert()
            .into(UserRolesEntity)
            .values({
              userCode: findUserCode.userCode,
              roleCode: findroleCode.roleCode,
              assignmentStartDate: new Date(),
            })
            .execute(),
        ])
      }

      return {
        message: `${existingUserRole ? 'Update' : 'Add'} role successful!`,
        status: 200,
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to add/update role for user')
    }
  }

  async findAll(data: GetListDto): Promise<PageSizeInterface> {
    try {
      const users = await this.userModel.find().exec()
      return {
        data: users.map(user => ({
          userCode: user._id,
          username: user.username,
          email: user.email,
          fullName: `${user.firstName} ${user.lastName}`,
          isValidateEmail: user.isValidateEmail,
        })),
        page: data.page,
        pageSize: data.limit,
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch users')
    }
  }

  async findById(userCode: string): Promise<UsersDocument> {
    try {
      const user = await this.userModel.findById(new Types.ObjectId(userCode)).exec()
      if (!user) {
        throw new NotFoundException('User not found')
      }
      return user
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new InternalServerErrorException('Failed to fetch user')
    }
  }

  async update(userCode: string, updateUserDto: UpdateUserDto): Promise<UsersDocument> {
    try {
      const user = await this.userModel
        .findByIdAndUpdate(userCode, updateUserDto, { new: true })
        .exec()
      if (!user) {
        throw new NotFoundException('User not found')
      }
      return user
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new InternalServerErrorException('Failed to update user')
    }
  }

  async delete(userCode: string, user: UsersDocument): Promise<PostMessageInterface> {
    try {
      const role = await this.rolesRepository.findRoleByCode(user.roleCode)
      const hasPermission =
        userCode === String(user._id) ||
        role.roleName === SUPER_ADMIN ||
        role.roleName === ADMIN_ROLE

      if (!hasPermission) {
        throw new ForbiddenException('You do not have permission to do this')
      }

      const deletedUser = await this.userModel
        .findByIdAndDelete(new Types.ObjectId(userCode))
        .exec()

      if (!deletedUser) {
        throw new NotFoundException('User not found')
      }

      return {
        message: 'Delete success!',
        statusCode: 200,
      }
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error
      }
      throw new InternalServerErrorException('Failed to delete user')
    }
  }

  async bulkUpdate(users: UpdateUserDto[]): Promise<any> {
    try {
      const bulkOps = users.map(user => ({
        updateOne: {
          filter: { _id: new Types.ObjectId(user._id) },
          update: { $set: user },
        },
      }))
      return await this.userModel.bulkWrite(bulkOps)
    } catch (error) {
      throw new InternalServerErrorException('Failed to bulk update users')
    }
  }

  async bulkDelete(userCodes: string[]): Promise<any> {
    try {
      return await this.userModel.deleteMany({ _id: { $in: userCodes } })
    } catch (error) {
      throw new InternalServerErrorException('Failed to bulk delete users')
    }
  }

  async search(searchParams: SearchUserDto): Promise<UsersDocument[]> {
    try {
      if (!searchParams.username) {
        return await this.userModel.find().exec()
      }

      const searchRegex = new RegExp(searchParams.username, 'i')
      return await this.userModel
        .find({
          $or: [
            { username: searchRegex },
            { email: searchRegex },
            { firstName: searchRegex },
            { lastName: searchRegex },
          ],
        })
        .exec()
    } catch (error) {
      throw new InternalServerErrorException('Failed to search users')
    }
  }

  async filter(filterParams: FilterUserDto): Promise<UsersDocument[]> {
    try {
      const query = Object.entries(filterParams)
        .filter(([_, value]) => value)
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})

      return await this.userModel.find(query).exec()
    } catch (error) {
      throw new InternalServerErrorException('Failed to filter users')
    }
  }

  async updateProfile(
    userCode: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<UsersDocument> {
    try {
      const user = await this.userModel.findById(userCode)
      if (!user) {
        throw new NotFoundException('User not found')
      }

      Object.assign(user, updateProfileDto)
      return await user.save()
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new InternalServerErrorException('Failed to update user profile')
    }
  }

  async getLoginHistory(userCode: string): Promise<any> {
    // TODO: Implement user login history
    throw new InternalServerErrorException('User login history not implemented')
  }

  async getChanges(userCode: string): Promise<any> {
    // TODO: Implement user changes history
    throw new InternalServerErrorException('User changes history not implemented')
  }

  async getActivity(userCode: string): Promise<any> {
    // TODO: Implement user activity
    throw new InternalServerErrorException('User activity not implemented')
  }
}
