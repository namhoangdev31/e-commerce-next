import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { UserSkillEntity } from './user-skill.entity'

@Entity('skills')
export class SkillsEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number

  @Column('varchar', { name: 'skillName', length: 100 })
  skillName: string

  @Column('varchar', { name: 'description', nullable: true, length: 256 })
  description: string | null

  @OneToMany(() => UserSkillEntity, userSkill => userSkill.skill)
  userSkills: UserSkillEntity[]
}
