import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
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
    unique: true,
  })
  @IsNotEmpty()
  @MinLength(6)
  description: string

  @Column({
    name: 'is_system',
    type: 'boolean',
    default: true,
  })
  @IsEmpty()
  isSystem: boolean

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date
  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date
}
