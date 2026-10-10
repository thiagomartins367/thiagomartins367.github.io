import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renderiza a página inicial com o perfil e a seção "Sobre Mim"', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
  expect(screen.getByText('Thiago Martins')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Sobre Mim' })).toBeInTheDocument();
});
