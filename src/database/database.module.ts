import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Users, UsersSchema } from './schemas/users.schema'
import { AuthRepository } from './repositories/auth.repository'
import { HeaderRepository } from './repositories/header.repository'
import { Header, HeaderSchema } from './schemas/header.schema'
import { NavItem, NavItemSchema } from './schemas/navItem.schema'
import { Roles, RolesSchema } from './schemas/roles.schema'
import { UserSkills, UserSkillsSchema } from './schemas/user-skills.schema'
import { UserRoles, UserRolesSchema } from './schemas/user-roles.schema'
import { Skills, SkillsSchema } from './schemas/skills.schema'
import { CustomRoles, CustomRolesSchema } from './schemas/custom-roles.schema'
import { SkillEndorsements, SkillEndorsementsSchema } from './schemas/SkillEndorsements.schema'
import { RolePermissions, RolePermissionsSchema } from './schemas/role-permissions.schema'
import { Permissions, PermissionsSchema } from './schemas/permissions.schema'
import {
  UserCustomFieldValues,
  UserCustomFieldValuesSchema,
} from './schemas/user-custom-field-values.schema'
import { User, UserSchema } from './schemas/user.schema'
import { Modules, ModuleSchema } from './schemas/modules.schema'
import { CustomFields, CustomFieldsSchema } from './schemas/custom-fields.schema'
import { UserSession, UserSessionSchema } from './schemas/user-session.schema'
import { RolesRepository } from './repositories/roles.repository'
import { SharedModule } from '../shared/shared.module'
import { UsersRepository } from './repositories/users.repository'
import { CoursesRepository } from './repositories/courses.repository'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersEntities } from '../modules/users/entities/user.entity'
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CustomFields.name, schema: CustomFieldsSchema },
      { name: CustomRoles.name, schema: CustomRolesSchema },
      { name: Header.name, schema: HeaderSchema },
      { name: Modules.name, schema: ModuleSchema },
      { name: NavItem.name, schema: NavItemSchema },
      { name: Permissions.name, schema: PermissionsSchema },
      { name: RolePermissions.name, schema: RolePermissionsSchema },
      { name: Roles.name, schema: RolesSchema },
      { name: SkillEndorsements.name, schema: SkillEndorsementsSchema },
      { name: Skills.name, schema: SkillsSchema },
      { name: UserCustomFieldValues.name, schema: UserCustomFieldValuesSchema },
      { name: User.name, schema: UserSchema },
      { name: UserRoles.name, schema: UserRolesSchema },
      { name: Users.name, schema: UsersSchema },
      { name: UserSkills.name, schema: UserSkillsSchema },
      { name: UserSession.name, schema: UserSessionSchema },
    ]),
    SharedModule,
    TypeOrmModule.forFeature([UsersEntities]),
  ],
  providers: [
    AuthRepository,
    HeaderRepository,
    RolesRepository,
    UsersRepository,
    CoursesRepository,
  ],
  exports: [AuthRepository, HeaderRepository, RolesRepository, UsersRepository, CoursesRepository],
})
export class DatabaseModule {}
