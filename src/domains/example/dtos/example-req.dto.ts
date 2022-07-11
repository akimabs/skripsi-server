import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GetExampleReqDto {
  @ApiProperty({
    description: 'example data',
    type: String,
  })
  @IsNotEmpty()
  exampleData: string;
}
