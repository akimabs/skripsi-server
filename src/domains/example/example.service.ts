import { HttpStatus, Injectable, Param } from '@nestjs/common';
import { Response } from '../../models/response.models';
import { SUCCESS_GET_EXAMPLE } from './constants/example.constant';

@Injectable()
export class ExampleService {
  constructor() {}
  async get(exampleData: string): Promise<Response> {
    const data = {
      exampleData
    };
    return new Response(SUCCESS_GET_EXAMPLE, HttpStatus.OK, data);
  }
}
