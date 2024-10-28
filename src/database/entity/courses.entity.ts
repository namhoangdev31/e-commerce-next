import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { AssessmentsEntity } from './assessments.entity'
import { ContentItemsEntity } from './content-items.entity'
import { ContentReleaseRulesEntity } from './content-release-rules.entity'
import { LearnerPathProgressEntity } from './learner-path-progress.entity'
import { LearningActivitiesEntity } from './learning-activities.entity'
import { PathCoursesEntity } from './path-courses.entity'
import { PrerequisitesEntity } from './prerequisites.entity'

@Index('elementId', ['elementId'], { unique: true })
@Index('fk_parentElement', ['parentElementId'], {})
@Entity('courses')
export class CoursesEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number

  @Column('text', { name: 'content' })
  content: string

  @Column('timestamp', {
    name: 'createdAt',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date

  @Column('text', { name: 'description' })
  description: string

  @Column('int', { name: 'elementId', unique: true })
  elementId: number

  @Column('enum', {
    name: 'elementType',
    enum: ['MODULE', 'LESSON', 'ACTIVITY'],
  })
  elementType: 'MODULE' | 'LESSON' | 'ACTIVITY'

  @Column('int', { name: 'parentElementId', nullable: true })
  parentElementId: number | null

  @Column('varchar', { name: 'title', length: 255 })
  title: string

  @Column('timestamp', {
    name: 'updatedAt',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date

  @OneToMany(() => AssessmentsEntity, assessments => assessments.course)
  assessments: AssessmentsEntity[]

  @OneToMany(() => ContentItemsEntity, contentItems => contentItems.element)
  contentItems: ContentItemsEntity[]

  @OneToMany(() => ContentReleaseRulesEntity, contentReleaseRules => contentReleaseRules.element)
  contentReleaseRules: ContentReleaseRulesEntity[]

  @ManyToOne(() => CoursesEntity, courses => courses.courses, {
    onDelete: 'SET NULL',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'parentElementId', referencedColumnName: 'id' }])
  parentElement: CoursesEntity

  @OneToMany(() => CoursesEntity, courses => courses.parentElement)
  courses: CoursesEntity[]

  @OneToMany(
    () => LearnerPathProgressEntity,
    learnerPathProgress => learnerPathProgress.currentCourse,
  )
  learnerPathProgresses: LearnerPathProgressEntity[]

  @OneToMany(() => LearningActivitiesEntity, learningActivities => learningActivities.element)
  learningActivities: LearningActivitiesEntity[]

  @OneToMany(() => PathCoursesEntity, pathCourses => pathCourses.course)
  pathCourses: PathCoursesEntity[]

  @OneToMany(() => PrerequisitesEntity, prerequisites => prerequisites.element)
  prerequisites: PrerequisitesEntity[]

  @OneToMany(() => PrerequisitesEntity, prerequisites => prerequisites.prerequisiteElement)
  prerequisites2: PrerequisitesEntity[]
}
