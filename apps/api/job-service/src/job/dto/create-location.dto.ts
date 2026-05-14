import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLocationDto {
  @ApiProperty({ example: 'Hanoi' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiPropertyOptional({ example: 'Cau Giay' })
  @IsString()
  @IsOptional()
  district?: string;

  @ApiPropertyOptional({ example: '123 Xuan Thuy' })
  @IsString()
  @IsOptional()
  address?: string;
}
