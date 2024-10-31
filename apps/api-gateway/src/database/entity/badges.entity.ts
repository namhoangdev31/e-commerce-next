import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { IsNotEmpty, IsString, IsUrl, Length, IsOptional } from 'class-validator'

@Entity('badges')
export class BadgesEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'badge_name', length: 100, unique: true })
  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  badgeName: string

  @Column({ nullable: true, type: 'text' })
  @IsString()
  @IsOptional()
  description: string

  @Column({ nullable: true, name: 'image_url', type: 'varchar' })
  @IsUrl()
  @IsOptional()
  imageUrl: string

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  updatedAt: Date
}
