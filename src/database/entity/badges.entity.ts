import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { IsNotEmpty, IsString, IsUrl, Length, IsOptional } from 'class-validator'

@Entity()
export class Badges {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'badge_name', length: 100, unique: true })
  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  badgeName: string

  @Column({ nullable: true, length: 500, type: 'text' })
  @IsString()
  @IsOptional()
  @Length(0, 500)
  description: string

  @Column({ nullable: true, name: 'image_url', type: 'varchar' })
  @IsUrl()
  @IsOptional()
  imageUrl: string

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date
}
