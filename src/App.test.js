import { render, screen } from '@testing-library/react';
import App from './App';

test('dummy test', () => {
  render(<App />);
  const linkElement = screen.getByText('login');
  expect(linkElement).toBeInTheDocument();
});
