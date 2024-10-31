import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { RoleEntity } from './role.entity'
import { PermissionsEntity } from './permissions.entity'

@Index('role_permission_id', ['rolePermissionId'], { unique: true })
@Index('role_id', ['roleId'], {})
@Index('permission_id', ['permissionId'], {})
@Entity('role_permissions')
export class RolePermissionsEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number

  @Column('varchar', { name: 'role_permission_id', unique: true, length: 255 })
  rolePermissionId: string

  @Column('int', { name: 'role_id' })
  roleId: number

  @Column('enum', { name: 'role_model', enum: ['Roles', 'CustomRoles'] })
  roleModel: 'Roles' | 'CustomRoles'

  @Column('int', { name: 'permission_id' })
  permissionId: number

  @Column('enum', { name: 'access_level', enum: ['Read', 'Write', 'Delete'] })
  accessLevel: 'Read' | 'Write' | 'Delete'

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  updatedAt: Date

  @ManyToOne(() => RoleEntity, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'role_id', referencedColumnName: 'id' }])
  role: RoleEntity

  @ManyToOne(() => PermissionsEntity, permissions => permissions.rolePermissions, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'permission_id', referencedColumnName: 'id' }])
  permission: PermissionsEntity
}
