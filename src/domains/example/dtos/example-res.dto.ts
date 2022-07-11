import { ApiProperty } from '@nestjs/swagger';
import { GetExampleReqDto } from './example-req.dto';

export class GetExampleResDto {
  @ApiProperty({ default: 200 })
  'code': number;
  @ApiProperty()
  'success': boolean;
  @ApiProperty()
  'message': string;
  @ApiProperty()
  'data': GetExampleReqDto;
}
