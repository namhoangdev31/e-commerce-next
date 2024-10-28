import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { CoursesEntity } from './courses.entity'

@Index('fk_course_content_item', ['elementId'], {})
@Entity('content_items')
export class ContentItemsEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number

  @Column('int', { name: 'elementId' })
  elementId: number

  @Column('enum', {
    name: 'contentType',
    enum: ['TEXT', 'VIDEO', 'AUDIO', 'DOCUMENT', 'QUIZ', 'INTERACTIVE'],
  })
  contentType: 'TEXT' | 'VIDEO' | 'AUDIO' | 'DOCUMENT' | 'QUIZ' | 'INTERACTIVE'

  @Column('text', { name: 'content' })
  content: string

  @Column('timestamp', {
    name: 'createdAt',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date

  @Column('timestamp', {
    name: 'updatedAt',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date

  @ManyToOne(() => CoursesEntity, courses => courses.contentItems, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'elementId', referencedColumnName: 'elementId' }])
  element: CoursesEntity
}
