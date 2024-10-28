import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { CoursesEntity } from './courses.entity'
import { LearningPathsEntity } from './learning-paths.entity'

@Index('fk_current_course', ['currentCourseId'], {})
@Index('fk_learning_path_progress', ['pathId'], {})
@Entity('learner_path_progress')
export class LearnerPathProgressEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number

  @Column('varchar', { name: 'learnerId', length: 255 })
  learnerId: string

  @Column('int', { name: 'pathId' })
  pathId: number

  @Column('int', { name: 'currentCourseId' })
  currentCourseId: number

  @Column('float', { name: 'overallProgress', precision: 12 })
  overallProgress: number

  @Column('timestamp', {
    name: 'lastActivityDate',
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastActivityDate: Date

  @Column('timestamp', { name: 'completionDate', nullable: true })
  completionDate: Date | null

  @ManyToOne(() => CoursesEntity, courses => courses.learnerPathProgresses, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'currentCourseId', referencedColumnName: 'elementId' }])
  currentCourse: CoursesEntity

  @ManyToOne(() => LearningPathsEntity, learningPaths => learningPaths.learnerPathProgresses, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'pathId', referencedColumnName: 'id' }])
  path: LearningPathsEntity
}
