import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { RoleEntity } from './role.entity'

@Index('custom_roles_roles_id_fk', ['parentRoleId'], {})
@Entity('custom_roles')
export class CustomRolesEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number

  @Column('varchar', { name: 'role_name', length: 255 })
  roleName: string

  @Column('varchar', { name: 'description', nullable: true, length: 255 })
  description: string | null

  @Column('int', { name: 'parent_role_id', nullable: true })
  parentRoleId: number | null

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

  @ManyToOne(() => RoleEntity, roles => roles.customRoles, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'parent_role_id', referencedColumnName: 'id' }])
  parentRole: RoleEntity
}
