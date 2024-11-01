import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { UserSkillEntity } from './user-skill.entity'
import { IsNotEmpty } from 'class-validator'

@Entity('skills')
export class SkillsEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number

  @Column({ name: 'skill_name', length: 100, type: 'varchar' })
  skillName: string

  @Column({ name: 'description', nullable: true, type: 'text' })
  @IsNotEmpty()
  description: string
}
