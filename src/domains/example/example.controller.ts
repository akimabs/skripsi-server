import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'src/models/response.models';
import { GetExampleReqDto } from './dtos/example-req.dto';
import { GetExampleResDto } from './dtos/example-res.dto';
import { ExampleService } from './example.service';

@ApiTags('example')
@Controller('example')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Get('')
  @ApiOkResponse({
    type: GetExampleResDto,
  })
  async get(@Query() getExampleDto: GetExampleReqDto): Promise<Response> {
    return this.exampleService.get(getExampleDto.exampleData);
  }
}
