import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm'
import { IsNotEmpty, IsString, IsOptional } from 'class-validator'

@Entity('guests')
export class Guest {
  @PrimaryGeneratedColumn()
  id: string

  @Column({ nullable: false, unique: true, name: 'guest_code' })
  @IsString()
  guestCode: string

  @Column({ nullable: false, name: 'device_id' })
  @IsString()
  @IsNotEmpty()
  deviceId: string

  @Column({ nullable: false, name: 'device_type' })
  @IsString()
  @IsNotEmpty()
  deviceType: string // 'mobile' | 'web' | 'tablet'

  @Column({ nullable: true, name: 'device_model' })
  @IsString()
  @IsOptional()
  deviceModel?: string

  @Column({ nullable: true, name: 'device_manufacturer' })
  @IsString()
  @IsOptional()
  deviceManufacturer?: string

  @Column({ nullable: true, name: 'os_name' })
  @IsString()
  @IsOptional()
  osName?: string

  @Column({ nullable: true, name: 'os_version' })
  @IsString()
  @IsOptional()
  osVersion?: string

  @Column({ nullable: true, name: 'browser_name' })
  @IsString()
  @IsOptional()
  browserName?: string

  @Column({ nullable: true, name: 'browser_version' })
  @IsString()
  @IsOptional()
  browserVersion?: string

  @Column({ nullable: true, name: 'ip_address' })
  @IsString()
  @IsOptional()
  ipAddress?: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
