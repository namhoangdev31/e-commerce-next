import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { LearnerPathProgressEntity } from './learner-path-progress.entity'
import { PathCoursesEntity } from './path-courses.entity'

@Entity('learning_paths')
export class LearningPathsEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number

  @Column('varchar', { name: 'pathName', length: 255 })
  pathName: string

  @Column('text', { name: 'description' })
  description: string

  @Column('varchar', { name: 'creatorId', length: 255 })
  creatorId: string

  @OneToMany(() => LearnerPathProgressEntity, learnerPathProgress => learnerPathProgress.path)
  learnerPathProgresses: LearnerPathProgressEntity[]

  @OneToMany(() => PathCoursesEntity, pathCourses => pathCourses.path)
  pathCourses: PathCoursesEntity[]
}
