import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Users } from './Users'

@Index('course_templates_users_id_fk', ['creatorId'], {})
@Entity('course_templates')
export class CourseTemplatesEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number

  @Column('varchar', { name: 'templateName', length: 255 })
  templateName: string

  @Column('text', { name: 'description' })
  description: string

  @Column('int', { name: 'creatorId' })
  creatorId: number

  @Column('tinyint', { name: 'isPublic', width: 1 })
  isPublic: boolean

  @Column('timestamp', {
    name: 'createdDate',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdDate: Date

  @Column('timestamp', {
    name: 'lastModifiedDate',
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastModifiedDate: Date

  @ManyToOne(() => Users, users => users.courseTemplates, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'creatorId', referencedColumnName: 'id' }])
  creator: Users
}
