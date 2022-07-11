import { Module } from '@nestjs/common';
import { ExampleController } from './domains/example/example.controller';
import { ExampleModule } from './domains/example/example.module';
import { ExampleService } from './domains/example/example.service';

@Module({
  imports: [ExampleModule],
  controllers: [ExampleController],
  providers: [ExampleService],
  exports: [ExampleService],
})
export class AppModule {}
