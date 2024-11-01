import { IsNotEmpty, IsEnum, IsOptional, IsString } from 'class-validator'
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm'

@Entity('user_roles')
@Unique(['username', 'roleCode'])
export class UserRolesEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    name: 'username',
    type: 'varchar',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  username: string

  @Column({
    name: 'role_code',
    type: 'varchar',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  roleCode: string

  @Column({
    name: 'assignment_start_date',
    type: 'timestamp',
    nullable: false,
  })
  @IsNotEmpty()
  assignmentStartDate: Date

  @Column({
    name: 'assignment_end_date',
    type: 'timestamp',
    nullable: true,
  })
  @IsOptional()
  assignmentEndDate: Date

  @Column({
    name: 'course_id',
    type: 'int',
    nullable: true,
  })
  @IsOptional()
  courseId: number

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
