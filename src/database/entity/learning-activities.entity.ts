import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { CoursesEntity } from './courses.entity'

@Index('fk_course_activity', ['elementId'], {})
@Entity('learning_activities')
export class LearningActivitiesEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number

  @Column('int', { name: 'elementId' })
  elementId: number

  @Column('enum', {
    name: 'activityType',
    enum: ['WEBINAR', 'SELF_PACED', 'BLENDED'],
  })
  activityType: 'WEBINAR' | 'SELF_PACED' | 'BLENDED'

  @Column('timestamp', {
    name: 'startDateTime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  startDateTime: Date

  @Column('timestamp', {
    name: 'endDateTime',
    default: () => "'0000-00-00 00:00:00'",
  })
  endDateTime: Date

  @Column('int', { name: 'maxParticipants' })
  maxParticipants: number

  @ManyToOne(() => CoursesEntity, courses => courses.learningActivities, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'elementId', referencedColumnName: 'elementId' }])
  element: CoursesEntity
}
