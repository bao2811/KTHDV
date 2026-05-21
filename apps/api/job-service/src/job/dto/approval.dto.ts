import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApprovalStatus } from '@prisma/client';

export class CreateApprovalDto {
  @ApiProperty({ enum: ApprovalStatus })
  @IsEnum(ApprovalStatus)
  @IsNotEmpty()
  status: ApprovalStatus;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  comment?: string;
}

export class RequestApprovalDto {
  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  reviewerId?: number;
}
