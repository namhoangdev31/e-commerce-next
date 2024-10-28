import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { QuizzesEntity } from './quizzes.entity'

@Index('fk_quiz_question', ['quizId'], {})
@Entity('questions')
export class QuestionsEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number

  @Column('int', { name: 'quizId' })
  quizId: number

  @Column('enum', {
    name: 'questionType',
    enum: ['MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER', 'ESSAY'],
  })
  questionType: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'ESSAY'

  @Column('text', { name: 'questionText' })
  questionText: string

  @Column('text', { name: 'correctAnswer' })
  correctAnswer: string

  @Column('int', { name: 'points' })
  points: number

  @ManyToOne(() => QuizzesEntity, quizzes => quizzes.questions, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'quizId', referencedColumnName: 'id' }])
  quiz: QuizzesEntity
}
