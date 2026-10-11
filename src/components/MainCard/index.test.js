import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MainCard from '.';

beforeEach(() => {
  window.scrollTo = jest.fn();
});

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

test('volta a página ao topo apenas ao trocar de aba', () => {
  render(<MainCard />);

  userEvent.click(screen.getByRole('button', { name: 'Sobre' }));
  expect(window.scrollTo).not.toHaveBeenCalled();

  userEvent.click(screen.getByRole('button', { name: 'Resumo' }));
  expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
});

test('pré-carrega as abas "Resumo" e "Projetos" ocultas', async () => {
  render(<MainCard />);

  await waitFor(() => {
    expect(screen.getByRole('heading', { name: 'Resumo', hidden: true })).not.toBeVisible();
  });
  expect(screen.getByRole('heading', { name: 'Projetos', hidden: true })).not.toBeVisible();
  expect(screen.getByRole('heading', { name: 'Sobre Mim' })).toBeVisible();
});

test('monta na hora uma aba clicada antes do pré-carregamento', () => {
  render(<MainCard />);

  userEvent.click(screen.getByRole('button', { name: 'Projetos' }));
  expect(screen.getByRole('heading', { name: 'Projetos' })).toBeVisible();
});
