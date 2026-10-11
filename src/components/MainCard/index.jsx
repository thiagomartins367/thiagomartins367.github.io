import { useEffect, useRef, useState } from 'react';
import About from '../About';
import Projects from '../Projects';
import Resume from '../Resume';
import './index.css';

const NAVBAR_OPTIONS = [
  { id: 'about', label: 'Sobre', title: 'Sobre Mim', Content: About },
  { id: 'resume', label: 'Resumo', title: 'Resumo', Content: Resume },
  { id: 'projects', label: 'Projetos', title: 'Projetos', Content: Projects },
];

// Tempo máximo esperando o navegador ficar ocioso antes de pré-carregar as outras abas
const PRELOAD_IDLE_TIMEOUT = 2000;

function MainCard() {
  const [selectedOptionId, setSelectedOptionId] = useState(NAVBAR_OPTIONS[0].id);
  const [mountedOptionIds, setMountedOptionIds] = useState([NAVBAR_OPTIONS[0].id]);
  const [hasSwitchedOption, setHasSwitchedOption] = useState(false);
  const contentRefs = useRef({});

  // As abas ficam montadas (as inativas com "hidden") para que a troca seja instantânea.
  // As demais só são montadas após o carregamento da página, para que as imagens não
  // disputem a conexão com a primeira tela.
  useEffect(() => {
    let idleId;
    let timeoutId;
    const mountAllOptions = () => setMountedOptionIds(NAVBAR_OPTIONS.map(({ id }) => id));
    const preloadOptions = () => {
      if ('requestIdleCallback' in window) {
        idleId = window.requestIdleCallback(
          mountAllOptions,
          { timeout: PRELOAD_IDLE_TIMEOUT },
        );
      } else {
        timeoutId = setTimeout(mountAllOptions);
      }
    };

    if (document.readyState === 'complete') preloadOptions();
    else window.addEventListener('load', preloadOptions, { once: true });

    return () => {
      window.removeEventListener('load', preloadOptions);
      if (idleId) window.cancelIdleCallback(idleId);
      clearTimeout(timeoutId);
    };
  }, []);

  // Cada aba mantém o conteúdo montado, então a rolagem interna é reiniciada ao exibi-la
  useEffect(() => {
    const content = contentRefs.current[selectedOptionId];
    if (content) content.scrollTop = 0;
  }, [selectedOptionId]);

  const selectOption = (id) => {
    if (id === selectedOptionId) return;
    window.scrollTo(0, 0);
    setMountedOptionIds((ids) => (ids.includes(id) ? ids : [...ids, id]));
    setHasSwitchedOption(true);
    setSelectedOptionId(id);
  };

  const panelAnimationClass = hasSwitchedOption ? 'quick-animation' : '';

  return (
    <>
      <nav className="navbar-options">
        {
          NAVBAR_OPTIONS.map(({ id, label }) => (
            <div key={ id }>
              <button
                type="button"
                className={ id === selectedOptionId ? 'navbar-option-active' : '' }
                aria-pressed={ id === selectedOptionId }
                onClick={ () => selectOption(id) }
              >
                { label }
              </button>
            </div>
          ))
        }
      </nav>
      <article className="article-main-card">
        {
          NAVBAR_OPTIONS
            .filter(({ id }) => mountedOptionIds.includes(id))
            .map(({ id, title, Content }) => (
              // O fade de troca roda ao remover o "hidden"; na primeira tela, quem revela o conteúdo é a tela de carregamento
              <div
                key={ id }
                className={ `div-main-card-panel ${panelAnimationClass}` }
                hidden={ id !== selectedOptionId }
              >
                <section className="section-nav-options-title">
                  <h2 className="h2-title">
                    { title }
                    <hr className="bottom-hr-title" />
                  </h2>
                </section>

                <section
                  className="content-render-section"
                  ref={ (element) => { contentRefs.current[id] = element; } }
                >
                  <Content />
                </section>
              </div>
            ))
        }
      </article>
    </>
  );
}

export default MainCard;
