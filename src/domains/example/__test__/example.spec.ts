import { Test, TestingModule } from '@nestjs/testing';
import { SUCCESS_GET_EXAMPLE } from '../constants/example.constant';
import { GetExampleResDto } from '../dtos/example-res.dto';
import { ExampleController } from '../example.controller';
import { ExampleModule } from '../example.module';
import { ExampleService } from '../example.service';

describe('Example Service', () => {
  let appController: ExampleController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ExampleModule],
      controllers: [ExampleController],
      providers: [ExampleService],
    }).compile();

    appController = app.get<ExampleController>(ExampleController);
  });

  const data = { exampleData: 'data', asd: 'asd' };

  const result: GetExampleResDto = {
    code: 200,
    success: true,
    message: SUCCESS_GET_EXAMPLE,
    data,
  };

  describe('root', () => {
    it('should return example response', async () => {
      expect(await appController.get(data)).toEqual(result);
    });
  });
});
