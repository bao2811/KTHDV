import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsNotEmpty } from 'class-validator';

export class CreateHardFilterDto {
  @ApiProperty({ enum: ['EXPERIENCE', 'EDUCATION', 'SKILL'] })
  @IsEnum(['EXPERIENCE', 'EDUCATION', 'SKILL'])
  filterType: 'EXPERIENCE' | 'EDUCATION' | 'SKILL';

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  requiredValue: string;

  @ApiProperty({ enum: ['GTE', 'EQ', 'IN'] })
  @IsEnum(['GTE', 'EQ', 'IN'])
  operator: 'GTE' | 'EQ' | 'IN';
}
