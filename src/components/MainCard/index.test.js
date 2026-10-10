import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MainCard from '.';

test('troca o título e a aba ativa ao navegar entre as abas', () => {
  render(<MainCard />);

  expect(screen.getByRole('heading', { name: 'Sobre Mim' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Sobre' }))
    .toHaveAttribute('aria-pressed', 'true');

  userEvent.click(screen.getByRole('button', { name: 'Resumo' }));
  expect(screen.getByRole('heading', { name: 'Resumo' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Resumo' }))
    .toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByRole('button', { name: 'Sobre' }))
    .toHaveAttribute('aria-pressed', 'false');

  userEvent.click(screen.getByRole('button', { name: 'Projetos' }));
  expect(screen.getByRole('heading', { name: 'Projetos' })).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'Resumo' })).not.toBeInTheDocument();
});
