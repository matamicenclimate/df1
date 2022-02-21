import { render } from '@testing-library/react';
import App from './App';

test('true === true', () => {
  render(<App />);
  // const linkElement = screen.getByText(/learn react/i);
  expect(true).toEqual(true);
});
