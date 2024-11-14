import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  Unique,
} from 'typeorm'
import { Users } from '../schemas/users.schema'
import { IsNotEmpty, IsBoolean, IsString, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

@Entity('groups')
@Unique(['groupCode'])
export class Group {
  @PrimaryGeneratedColumn()
  id: string

  @Column({
    name: 'group_code',
    type: 'varchar',
  })
  @ApiProperty({ description: 'Group code', example: '123456' })
  @IsString()
  @IsNotEmpty()
  groupCode: string

  @Column({
    name: 'group_name',
    type: 'varchar',
  })
  @ApiProperty({ description: 'Group name', example: 'Group 1' })
  @IsString()
  @IsNotEmpty()
  groupName: string

  @Column({ nullable: true })
  @ApiProperty({ description: 'Group description', example: 'Group 1 description' })
  @IsString()
  @IsOptional()
  description: string

  @Column({ default: 'chat' })
  @ApiProperty({ description: 'Group type', example: 'chat' })
  @IsString()
  @IsNotEmpty()
  type: 'chat' | 'lesson' | 'learning'

  @Column({ default: true, name: 'is_active', type: 'tinyint' })
  @ApiProperty({ description: 'Group is active', example: true })
  @IsBoolean()
  isActive: boolean

  @Column({ nullable: true, name: 'max_members' })
  maxMembers: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
