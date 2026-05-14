import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ example: 'Google' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'https://logo.com/logo.png' })
  @IsUrl()
  @IsOptional()
  logoUrl?: string;

  @ApiPropertyOptional({ example: 'Technology' })
  @IsString()
  @IsOptional()
  industry?: string;

  @ApiPropertyOptional({ example: '10000+' })
  @IsString()
  @IsOptional()
  size?: string;

  @ApiPropertyOptional({ example: 'https://google.com' })
  @IsUrl()
  @IsOptional()
  website?: string;

  @ApiPropertyOptional({ example: 'About the company...' })
  @IsString()
  @IsOptional()
  description?: string;
}
