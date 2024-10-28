import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { UserSkillEntity } from './user-skill.entity'
import { UsersEntities } from './user.entity'

@Index('endorsement_id', ['endorsementId'], { unique: true })
@Index('user_skill_id', ['userSkillId'], {})
@Index('endorser_id', ['endorserId'], {})
@Entity('skill_endorsements')
export class SkillEndorsementsEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number

  @Column('varchar', { name: 'endorsement_id', unique: true, length: 255 })
  endorsementId: string

  @Column('int', { name: 'user_skill_id' })
  userSkillId: number

  @Column('int', { name: 'endorser_id' })
  endorserId: number

  @Column('datetime', { name: 'endorsement_date' })
  endorsementDate: Date

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

  @ManyToOne(() => UserSkillEntity, userSkill => userSkill.skillEndorsements, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'user_skill_id', referencedColumnName: 'id' }])
  userSkill: UserSkillEntity

  @ManyToOne(() => UsersEntities, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'endorser_id', referencedColumnName: 'id' }])
  endorser: UsersEntities
}
