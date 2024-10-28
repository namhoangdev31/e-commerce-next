import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { CoursesEntity } from './courses.entity'

@Index('fk_course_assessment', ['courseId'], {})
@Entity('assessments')
export class AssessmentsEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number

  @Column('int', { name: 'courseId' })
  courseId: number

  @Column('varchar', { name: 'title', length: 255 })
  title: string

  @Column('text', { name: 'description' })
  description: string

  @Column('int', { name: 'timeLimit' })
  timeLimit: number

  @Column('tinyint', { name: 'randomizeQuestions', width: 1 })
  randomizeQuestions: boolean

  @Column('tinyint', { name: 'showFeedback', width: 1 })
  showFeedback: boolean

  @Column('tinyint', { name: 'plagiarismCheckEnabled', width: 1 })
  plagiarismCheckEnabled: boolean

  @ManyToOne(() => CoursesEntity, courses => courses.assessments, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'courseId', referencedColumnName: 'elementId' }])
  course: CoursesEntity
}
