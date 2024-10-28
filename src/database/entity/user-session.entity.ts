import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { UsersEntities } from './user.entity'

@Index('userId', ['userId'], {})
@Entity('user_session')
export class UserSessionEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number

  @Column('int', { name: 'userId' })
  userId: number

  @Column('varchar', { name: 'token', nullable: true, length: 255 })
  token: string | null

  @Column('datetime', {
    name: 'expiresAt',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  expiresAt: Date | null

  @Column('tinyint', {
    name: 'isRevoked',
    nullable: true,
    width: 1,
    default: () => "'0'",
  })
  isRevoked: boolean | null

  @Column('varchar', { name: 'userAgent', length: 255 })
  userAgent: string

  @Column('varchar', { name: 'ipAddress', length: 255 })
  ipAddress: string

  @Column('tinyint', {
    name: 'isOnline',
    nullable: true,
    width: 1,
    default: () => "'1'",
  })
  isOnline: boolean | null

  @Column('datetime', {
    name: 'lastActiveAt',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastActiveAt: Date | null

  @Column('datetime', {
    name: 'create_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createAt: Date | null

  @Column('datetime', {
    name: 'update_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateAt: Date | null

  @ManyToOne(() => UsersEntities, users => users.userSessions, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: UsersEntities
}
