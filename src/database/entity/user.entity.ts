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
import { UserSessionEntity } from './user-session.entity'

@Entity('users')
@Unique(['username', 'email', 'userCode'])
export class UsersEntities {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    name: 'user_code',
    type: 'varchar',
  })
  @IsString()
  @IsNotEmpty()
  userCode: string

  @Column({
    name: 'username',
    type: 'varchar',
  })
  @IsString()
  @IsNotEmpty()
  username: string

  @Column({
    name: 'email',
    type: 'varchar',
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
    name: 'role_code',
    type: 'varchar',
    nullable: true,
  })
  roleCode: string

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
}
