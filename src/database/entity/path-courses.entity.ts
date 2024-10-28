import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { LearningPathsEntity } from './learning-paths.entity'
import { CoursesEntity } from './courses.entity'

@Index('fk_learning_path', ['pathId'], {})
@Index('fk_path_course', ['courseId'], {})
@Entity('path_courses')
export class PathCoursesEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number

  @Column('int', { name: 'pathId' })
  pathId: number

  @Column('int', { name: 'courseId' })
  courseId: number

  @Column('int', { name: 'orderIndex' })
  orderIndex: number

  @Column('tinyint', { name: 'isMandatory', width: 1 })
  isMandatory: boolean

  @Column('text', { name: 'completionCriteria' })
  completionCriteria: string

  @ManyToOne(() => LearningPathsEntity, learningPaths => learningPaths.pathCourses, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'pathId', referencedColumnName: 'id' }])
  path: LearningPathsEntity

  @ManyToOne(() => CoursesEntity, courses => courses.pathCourses, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'courseId', referencedColumnName: 'elementId' }])
  course: CoursesEntity
}
