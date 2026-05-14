import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { SkillLevel } from '@prisma/client';

export class AddJobSkillDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  skillId: number;

  @ApiProperty({ enum: SkillLevel })
  @IsEnum(SkillLevel)
  @IsNotEmpty()
  level: SkillLevel;

  @ApiPropertyOptional({ default: 0 })
  @IsInt()
  @IsOptional()
  @Min(0)
  minYears?: number;
}
