import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { CoursesEntity } from './courses.entity'

@Index('fk_course_prerequisite', ['elementId'], {})
@Index('fk_prerequisite_element', ['prerequisiteElementId'], {})
@Entity('prerequisites')
export class PrerequisitesEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number

  @Column('int', { name: 'elementId' })
  elementId: number

  @Column('int', { name: 'prerequisiteElementId' })
  prerequisiteElementId: number

  @Column('enum', {
    name: 'prerequisiteType',
    enum: ['COMPLETION', 'SCORE', 'DATE'],
  })
  prerequisiteType: 'COMPLETION' | 'SCORE' | 'DATE'

  @Column('text', { name: 'prerequisiteValue' })
  prerequisiteValue: string

  @ManyToOne(() => CoursesEntity, courses => courses.prerequisites, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'elementId', referencedColumnName: 'elementId' }])
  element: CoursesEntity

  @ManyToOne(() => CoursesEntity, courses => courses.prerequisites2, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'prerequisiteElementId', referencedColumnName: 'elementId' }])
  prerequisiteElement: CoursesEntity
}
