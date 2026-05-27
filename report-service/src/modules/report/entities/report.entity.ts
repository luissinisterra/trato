import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('reports')
export class ReportEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('integer')
  user_id: number;

  @Column({
    type: 'enum',
    enum: ['auction_history', 'bid_history', 'earnings', 'sales_summary'],
  })
  type: string;

  @Column('jsonb')
  data: Record<string, any>;

  @Column({ type: 'timestamptz', nullable: true })
  generated_at: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
