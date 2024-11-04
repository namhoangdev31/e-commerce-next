import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm'
import { IsNotEmpty, IsString, IsUrl, Length, IsOptional } from 'class-validator'

@Entity('badges')
@Unique(['badgeCode', 'badgeName'])
export class BadgesEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'badge_code', length: 100 })
  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  badgeCode: string

  @Column({ name: 'badge_name', length: 100 })
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
