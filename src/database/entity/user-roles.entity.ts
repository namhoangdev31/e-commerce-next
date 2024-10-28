import { IsNotEmpty, IsEnum, IsOptional } from 'class-validator'
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { UsersEntities } from './user.entity'
import { RoleEntity } from './role.entity'

enum RoleModel {
  Roles = 'Roles',
  CustomRoles = 'CustomRoles',
}

@Entity('user_roles')
export class UserRolesEntity {
  @PrimaryGeneratedColumn()
  @IsNotEmpty()
  id: number

  @Column({
    name: 'user_id',
    type: 'int',
    nullable: false,
  })
  @IsNotEmpty()
  userId: number

  @Column({
    name: 'role_id',
    type: 'int',
    nullable: false,
  })
  @IsNotEmpty()
  roleId: number

  @Column({
    name: 'role_model',
    type: 'enum',
    enum: RoleModel,
    nullable: false,
  })
  @IsNotEmpty()
  @IsEnum(RoleModel)
  roleModel: RoleModel

  @Column({
    name: 'assignment_start_date',
    type: 'datetime',
    nullable: false,
  })
  @IsNotEmpty()
  assignmentStartDate: Date

  @Column({
    name: 'assignment_end_date',
    type: 'datetime',
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
  })
  createdAt: Date

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date

  @ManyToOne(() => UsersEntities, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UsersEntities

  @ManyToOne(() => RoleEntity, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity

  // @ManyToOne(() => CoursesEntity, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'course_id' })
  // course: CoursesEntity
}
