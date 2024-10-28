import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Index('IDX_62f92fad6aa96e4ba547654370', ['badgeName'], { unique: true })
@Entity('badges')
export class Badges {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number

  @Column('varchar', { name: 'badge_name', unique: true, length: 100 })
  badgeName: string

  @Column('text', { name: 'description', nullable: true })
  description: string | null

  @Column('varchar', { name: 'image_url', nullable: true, length: 255 })
  imageUrl: string | null

  @Column('timestamp', {
    name: 'created_at',
    default: () => "'CURRENT_TIMESTAMP(6)'",
  })
  createdAt: Date

  @Column('timestamp', {
    name: 'updated_at',
    default: () => "'CURRENT_TIMESTAMP(6)'",
  })
  updatedAt: Date
}
