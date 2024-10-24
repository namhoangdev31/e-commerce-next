import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { IsEmail, IsNotEmpty, IsString, IsOptional, IsBoolean, IsDate } from 'class-validator'

@Entity('users')
@Unique(['username', 'email'])
export class UsersEntities {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @IsString()
  @IsNotEmpty()
  username: string

  @Column()
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

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date
}
