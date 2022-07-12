import { AllExceptionsFilter } from '../exception.filter';

test('Test Error', () => {
  const t = () => {
    throw new AllExceptionsFilter();
  };
  expect(t).toThrow(AllExceptionsFilter);
});
