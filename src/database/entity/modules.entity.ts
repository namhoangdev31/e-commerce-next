import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('modules')
export class ModulesEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'module_name', type: 'varchar', length: 255 })
  moduleName: string

  @Column({ type: 'text', nullable: true })
  description: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
