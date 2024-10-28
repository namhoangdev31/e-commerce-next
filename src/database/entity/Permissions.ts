import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Modules } from './Modules'
import { RolePermissionsEntity } from './role-permissions.entity'
import { ModulesEntity } from './modules.entity'

@Entity('permissions')
export class Permissions {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number

  @Column('varchar', { name: 'permission_name', length: 255 })
  permissionName: string

  @Column('text', { name: 'description', nullable: true })
  description: string | null

  @Column('varchar', { name: 'name', length: 255 })
  name: string

  @Column('datetime', {
    name: 'created_at',
    default: () => "'CURRENT_TIMESTAMP(6)'",
  })
  createdAt: Date

  @Column('datetime', {
    name: 'updated_at',
    default: () => "'CURRENT_TIMESTAMP(6)'",
  })
  updatedAt: Date

  @ManyToOne(() => ModulesEntity, modules => modules.permissions, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'module_id', referencedColumnName: 'id' }])
  module: ModulesEntity

  @OneToMany(() => RolePermissionsEntity, rolePermissions => rolePermissions.permission)
  rolePermissions: RolePermissionsEntity[]
}
