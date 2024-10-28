import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { ModulesEntity } from './modules.entity'

@Entity('permissions')
export class PermissionsEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'permission_name', type: 'varchar', length: 255 })
  permissionName: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ name: 'module_id', nullable: true })
  moduleId: number

  @Column({ type: 'varchar', length: 255 })
  name: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @ManyToOne(() => ModulesEntity, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'module_id' })
  module: ModulesEntity
}
