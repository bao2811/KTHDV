import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { JobType, JobStatus } from '@prisma/client';

export class CreateJobDto {
  @ApiProperty({ example: 'Senior Node.js Developer' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Job description here...' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ example: 1000 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  salaryMin?: number;

  @ApiPropertyOptional({ example: 2000 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  salaryMax?: number;

  @ApiPropertyOptional({ example: 2 })
  @IsInt()
  @IsOptional()
  @Min(0)
  experienceYears?: number;

  @ApiPropertyOptional({ enum: JobType, example: JobType.FULL_TIME })
  @IsEnum(JobType)
  @IsOptional()
  jobType?: JobType;

  @ApiPropertyOptional({ enum: JobStatus, example: JobStatus.DRAFT })
  @IsEnum(JobStatus)
  @IsOptional()
  status?: JobStatus;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  companyId?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  categoryId?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  locationId?: number;

  @ApiPropertyOptional({ example: '2026-12-31T23:59:59Z' })
  @IsString()
  @IsOptional()
  expiredAt?: string;
}
