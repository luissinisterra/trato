import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('report_requests')
export class ReportRequestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('integer')
  user_id: number;

  @Column({
    type: 'enum',
    enum: ['auction_history', 'bid_history', 'earnings', 'sales_summary'],
  })
  report_type: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending',
  })
  status: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
