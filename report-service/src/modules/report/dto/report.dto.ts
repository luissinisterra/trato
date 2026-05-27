import { IsEnum, IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreateReportDto {
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  user_id: number;

  @IsEnum(['auction_history', 'bid_history', 'earnings', 'sales_summary'])
  @IsNotEmpty()
  type: string;
}

export class UpdateReportStatusDto {
  @IsEnum(['pending', 'processing', 'completed', 'failed'])
  @IsNotEmpty()
  status: string;
}
