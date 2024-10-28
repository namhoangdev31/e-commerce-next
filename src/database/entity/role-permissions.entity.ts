import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Permissions } from './Permissions'
import { RoleEntity } from './role.entity'

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

  @Column('timestamp', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date

  @Column('timestamp', {
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date

  @ManyToOne(() => RoleEntity, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'role_id', referencedColumnName: 'id' }])
  role: RoleEntity

  @ManyToOne(() => Permissions, permissions => permissions.rolePermissions, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'permission_id', referencedColumnName: 'id' }])
  permission: Permissions
}
