import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { CoursesEntity } from './courses.entity'

@Index('fk_course_release_rule', ['elementId'], {})
@Entity('content_release_rules')
export class ContentReleaseRulesEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number

  @Column('int', { name: 'elementId' })
  elementId: number

  @Column('enum', {
    name: 'ruleType',
    enum: ['DATE', 'PROGRESS', 'PERFORMANCE'],
  })
  ruleType: 'DATE' | 'PROGRESS' | 'PERFORMANCE'

  @Column('text', { name: 'ruleValue' })
  ruleValue: string

  @Column('timestamp', { name: 'startDate', nullable: true })
  startDate: Date | null

  @Column('timestamp', { name: 'endDate', nullable: true })
  endDate: Date | null

  @ManyToOne(() => CoursesEntity, courses => courses.contentReleaseRules, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'elementId', referencedColumnName: 'elementId' }])
  element: CoursesEntity
}
