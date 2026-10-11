import hideLoadingScreenWhenReady from './loadingScreen';

const sleep = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

const renderLoadingScreen = (imageDecode) => {
  document.body.innerHTML = `
    <div id="loading-screen"></div>
    <main id="root"><img alt="" /></main>
  `;
  if (imageDecode) document.querySelector('img').decode = imageDecode;
  document.documentElement.classList.add('is-loading');
  return document.getElementById('root');
};

test('mantém a tela de carregamento por 1 segundo mesmo com a primeira tela pronta', async () => {
  window.loadingScreenShownAt = performance.now();
  const hiding = hideLoadingScreenWhenReady(renderLoadingScreen());

  await sleep(900);
  expect(document.getElementById('loading-screen')).not.toHaveClass('loading-screen-hidden');
  expect(document.documentElement).toHaveClass('is-loading');

  await hiding;
  expect(document.getElementById('loading-screen')).not.toBeInTheDocument();
  expect(document.documentElement).not.toHaveClass('is-loading');
});

test('esconde a tela logo quando ela já foi exibida por 1 segundo', async () => {
  window.loadingScreenShownAt = performance.now() - 1000;
  const startedAt = performance.now();

  await hideLoadingScreenWhenReady(renderLoadingScreen());

  expect(document.getElementById('loading-screen')).not.toBeInTheDocument();
  expect(performance.now() - startedAt).toBeLessThan(900);
});

test('esconde a tela mesmo se uma imagem da primeira tela falhar', async () => {
  window.loadingScreenShownAt = performance.now() - 1000;

  await hideLoadingScreenWhenReady(renderLoadingScreen(() => Promise.reject(new Error())));

  expect(document.getElementById('loading-screen')).not.toBeInTheDocument();
});
