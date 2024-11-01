import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { SkillsEntity } from './skills.entity'
import { UsersEntities } from './user.entity'

@Index('user_skill_users_id_fk', ['userId'], {})
@Index('user_skill_user_skill_skillId_fk', ['skillId'], {})
@Entity('user_skill')
export class UserSkillEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number

  @Column('int', { name: 'userId' })
  userId: number

  @Column('int', { name: 'skillId' })
  skillId: number

  @Column('enum', {
    name: 'proficiencyLevel',
    enum: ['Beginner', 'Intermediate', 'Expert'],
  })
  proficiencyLevel: 'Beginner' | 'Intermediate' | 'Expert'

  @Column('tinyint', { name: 'selfAssessed', width: 1 })
  selfAssessed: boolean

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
}
