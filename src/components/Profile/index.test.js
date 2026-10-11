import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Profile from '.';

test('expande e recolhe os contatos pelo botão "Mais informações"', () => {
  render(<Profile />);
  const button = screen.getByRole('button', { name: 'Mais informações' });

  expect(button).toHaveAttribute('aria-expanded', 'false');

  userEvent.click(button);
  expect(button).toHaveAttribute('aria-expanded', 'true');

  userEvent.click(button);
  expect(button).toHaveAttribute('aria-expanded', 'false');
});
