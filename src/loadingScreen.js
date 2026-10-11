// Tempo mínimo em que a tela de carregamento fica visível, mesmo com a primeira tela pronta
const MIN_DISPLAY_TIME = 1000;
// Tempo máximo esperando a primeira tela ficar pronta, para conexões lentas
const MAX_WAIT_TIME = 3000;
// Duração do fade-out definido no CSS inline do public/index.html
const FADE_OUT_TIME = 300;
// Pesos da fonte Poppins carregados no public/index.html
const FONT_WEIGHTS = ['200', '400', '600'];

let isHiding = false;

const sleep = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

const waitForFonts = () => {
  if (!document.fonts) return Promise.resolve();
  return Promise.all(
    FONT_WEIGHTS.map((weight) => document.fonts.load(`${weight} 1em Poppins`)),
  );
};

const waitForImages = (container) => Promise.all(
  [...container.querySelectorAll('img')]
    .map((img) => (img.decode ? img.decode().catch(() => {}) : Promise.resolve())),
);

// Esconde a tela de carregamento do public/index.html quando as fontes e as imagens
// da primeira tela estiverem prontas, respeitando o tempo mínimo de exibição
export default async function hideLoadingScreenWhenReady(firstScreen) {
  const loadingScreen = document.getElementById('loading-screen');
  if (!loadingScreen || isHiding) return;
  isHiding = true;

  const shownAt = window.loadingScreenShownAt ?? 0;
  const firstScreenReady = Promise.all([waitForFonts(), waitForImages(firstScreen)])
    .catch(() => {});

  await Promise.all([
    sleep(Math.max(0, shownAt + MIN_DISPLAY_TIME - performance.now())),
    Promise.race([firstScreenReady, sleep(MAX_WAIT_TIME)]),
  ]);

  document.documentElement.classList.remove('is-loading');
  loadingScreen.classList.add('loading-screen-hidden');
  await sleep(FADE_OUT_TIME);
  loadingScreen.remove();
  isHiding = false;
}
