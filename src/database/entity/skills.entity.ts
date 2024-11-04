import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { UserSkillEntity } from './user-skill.entity'
import { IsNotEmpty } from 'class-validator'

@Entity('skills')
@Unique(['skillCode', 'skillName'])
export class SkillsEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number
  @Column({ name: 'skill_code', length: 100, type: 'varchar' })
  skillCode: string
  @Column({ name: 'skill_name', length: 100, type: 'varchar' })
  skillName: string

  @Column({ name: 'description', nullable: true, type: 'text' })
  @IsNotEmpty()
  description: string
}
