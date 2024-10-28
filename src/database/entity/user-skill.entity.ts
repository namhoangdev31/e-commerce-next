import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { SkillEndorsementsEntity } from './skill-endorsements.entity'
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

  @Column('timestamp', {
    name: 'createdAt',
    default: () => "'CURRENT_TIMESTAMP(6)'",
  })
  createdAt: Date

  @Column('timestamp', {
    name: 'updatedAt',
    default: () => "'CURRENT_TIMESTAMP(6)'",
  })
  updatedAt: Date

  @OneToMany(() => SkillEndorsementsEntity, skillEndorsements => skillEndorsements.userSkill)
  skillEndorsements: SkillEndorsementsEntity[]

  @ManyToOne(() => SkillsEntity, skills => skills.userSkills, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'skillId', referencedColumnName: 'id' }])
  skill: SkillsEntity

  @ManyToOne(() => UsersEntities, users => users.userSkills, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: UsersEntities
}
