import { AllExceptionsFilter } from '../exception.filter';

test('Test description', () => {
  const t = () => {
    throw new AllExceptionsFilter();
  };
  expect(t).toThrow(AllExceptionsFilter);
});
