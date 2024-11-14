import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Group } from './group.entity'

@Entity('user_groups')
export class UserGroup {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'user_code' })
  userCode: string

  @Column({ name: 'group_code' })
  groupCode: string

  @Column({ default: false })
  isAdmin: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
