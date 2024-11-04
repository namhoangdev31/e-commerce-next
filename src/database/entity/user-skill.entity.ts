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

@Entity('user_skill')
export class UserSkillEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number

  @Column('int', { name: 'user_code' })
  userCode: number

  @Column('int', { name: 'skill_code' })
  skillCode: number

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
