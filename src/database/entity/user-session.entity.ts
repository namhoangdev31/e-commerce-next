import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { UsersEntities } from './user.entity'

@Entity('user_session')
export class UserSessionEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number

  @Column('varchar', { name: 'user_code' })
  userCode: string

  @Column('varchar', { name: 'token', nullable: true, length: 255 })
  token: string | null

  @Column('datetime', {
    name: 'expires_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  expiresAt: Date | null

  @Column('tinyint', {
    name: 'is_revoked',
    nullable: true,
    width: 1,
    default: () => "'0'",
  })
  isRevoked: boolean | null

  @Column('varchar', { name: 'user_agent', length: 255 })
  userAgent: string

  @Column('varchar', { name: 'ip_address', length: 255 })
  ipAddress: string

  @Column('tinyint', {
    name: 'is_online',
    nullable: true,
    width: 1,
    default: () => "'1'",
  })
  isOnline: boolean | null

  @Column('datetime', {
    name: 'last_activeAt',
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
}
