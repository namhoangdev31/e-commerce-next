import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm'
import { ModulesEntity } from './modules.entity'
import { RolePermissionsEntity } from './role-permissions.entity'

@Unique(['permissionName', 'permissionCode'])
@Entity('permissions')
export class PermissionsEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'permission_name', type: 'varchar', length: 255 })
  permissionName: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ name: 'module_id', nullable: true })
  moduleCode: number

  @Column({ name: 'permission_code', type: 'varchar', length: 255 })
  permissionCode: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
