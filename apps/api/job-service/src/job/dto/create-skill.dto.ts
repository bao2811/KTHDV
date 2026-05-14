import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSkillDto {
  @ApiProperty({ example: 'Node.js' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Backend' })
  @IsString()
  @IsOptional()
  category?: string;
}
