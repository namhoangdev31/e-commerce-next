import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { UserCustomFieldValuesEntity } from './user-custom-field-values.entity'

@Entity('custom_fields')
export class CustomFieldsEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number

  @Column('varchar', { name: 'field_name', length: 255 })
  fieldName: string

  @Column('varchar', { name: 'field_type', length: 50 })
  fieldType: string

  @Column('tinyint', { name: 'is_user_defined', width: 1 })
  isUserDefined: boolean

  @Column('enum', { name: 'privacy_setting', enum: ['Public', 'Private'] })
  privacySetting: 'Public' | 'Private'

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

  @OneToMany(
    () => UserCustomFieldValuesEntity,
    userCustomFieldValues => userCustomFieldValues.customField,
  )
  userCustomFieldValues: UserCustomFieldValuesEntity[]
}
