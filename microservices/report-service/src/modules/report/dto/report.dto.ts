import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateReportDto {
  @IsEnum(['auction_history', 'bid_history', 'earnings', 'sales_summary'])
  @IsNotEmpty()
  type: string;
}

export class UpdateReportStatusDto {
  @IsEnum(['pending', 'processing', 'completed', 'failed'])
  @IsNotEmpty()
  status: string;
}
