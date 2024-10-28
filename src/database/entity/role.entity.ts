import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'
import { IsEmpty, IsNotEmpty, MinLength } from 'class-validator'

@Entity('roles')
export class RoleEntity {
  @PrimaryGeneratedColumn()
  @IsNotEmpty()
  id: number

  @Column({
    name: 'role_name',
    type: 'varchar',
    length: 100,
  })
  @IsNotEmpty()
  @MinLength(6)
  roleName: string

  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
  })
  @IsNotEmpty()
  description: string

  @Column({
    name: 'is_system',
    type: 'boolean',
    default: true,
  })
  @IsEmpty()
  isSystem: boolean

  @CreateDateColumn({
    name: 'created_at',
  })
  created_at: Date

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updated_at: Date
}
