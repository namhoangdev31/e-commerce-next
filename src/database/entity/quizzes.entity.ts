import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { QuestionsEntity } from './questions.entity'

@Entity('quizzes')
export class QuizzesEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number

  @Column('varchar', { name: 'title', length: 255 })
  title: string

  @OneToMany(() => QuestionsEntity, questions => questions.quiz)
  questions: QuestionsEntity[]
}
