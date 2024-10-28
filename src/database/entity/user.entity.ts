import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm'
import { IsEmail, IsNotEmpty, IsString, IsOptional, IsBoolean, IsDate } from 'class-validator'
import { RoleEntity } from './role.entity'
import { UserRolesEntity } from './user-roles.entity'
import { UserSkillEntity } from './user-skill.entity'
import { UserCustomFieldValuesEntity } from './user-custom-field-values.entity'
import { CourseTemplatesEntity } from './course-templates.entity'
import { UserSessionEntity } from './user-session.entity'

@Entity('users')
@Unique(['username', 'email'])
export class UsersEntities {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    unique: true,
  })
  @IsString()
  @IsNotEmpty()
  username: string

  @Column({
    unique: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @Column()
  @IsString()
  @IsNotEmpty()
  passwordHash: string

  @Column()
  @IsString()
  @IsNotEmpty()
  firstName: string

  @Column()
  @IsString()
  @IsNotEmpty()
  lastName: string

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  profilePictureUrl?: string

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  refreshToken?: string

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  otpConfirm?: string

  @Column({ default: false })
  @IsOptional()
  @IsBoolean()
  isValidateEmail: boolean

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @IsOptional()
  @IsDate()
  timeUpdateOtp?: Date

  @Column({
    name: 'role_id',
    type: 'int',
    nullable: true,
  })
  roleId: number

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date

  @ManyToOne(() => RoleEntity, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity

  @OneToMany(() => UserRolesEntity, userRole => userRole.user)
  userRoles: UserRolesEntity[]

  @OneToMany(() => UserSkillEntity, userRole => userRole.user)
  userSkills: UserSkillEntity[]

  @OneToMany(() => UserCustomFieldValuesEntity, userCustomFieldValues => userCustomFieldValues.user)
  userCustomFieldValues: UserCustomFieldValuesEntity[]

  //courseTemplates
  @OneToMany(() => CourseTemplatesEntity, courseTemplates => courseTemplates.creator)
  courseTemplates: CourseTemplatesEntity[]

  //userSessions
  @OneToMany(() => UserSessionEntity, userSessions => userSessions.user)
  userSessions: UserSessionEntity[]
}
