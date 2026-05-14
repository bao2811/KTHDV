import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class ExtendJobDto {
  @ApiProperty({ description: 'Ngày hết hạn mới' })
  @IsDateString()
  @IsNotEmpty()
  expiredAt: string;
}
