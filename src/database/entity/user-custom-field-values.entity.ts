import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { CustomFieldsEntity } from './custom-fields.entity'
import { UsersEntities } from './user.entity'

@Index('user_custom_field_value_id', ['userCustomFieldValueId'], {
  unique: true,
})
@Index('user_id', ['userId'], {})
@Index('custom_field_id', ['customFieldId'], {})
@Entity('user_custom_field_values')
export class UserCustomFieldValuesEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number

  @Column('varchar', {
    name: 'user_custom_field_value_id',
    unique: true,
    length: 255,
  })
  userCustomFieldValueId: string

  @Column('int', { name: 'user_id' })
  userId: number

  @Column('int', { name: 'custom_field_id' })
  customFieldId: number

  @Column('varchar', { name: 'field_value', length: 255 })
  fieldValue: string

  @Column('timestamp', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date

  @Column('timestamp', {
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date

  @ManyToOne(() => UsersEntities, users => users.userCustomFieldValues, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: UsersEntities

  @ManyToOne(() => CustomFieldsEntity, customFields => customFields.userCustomFieldValues, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'custom_field_id', referencedColumnName: 'id' }])
  customField: CustomFieldsEntity
}
