import { useState } from 'react';
import About from '../About';
import Projects from '../Projects';
import Resume from '../Resume';
import './index.css';

const NAVBAR_OPTIONS = [
  { id: 'about', label: 'Sobre', title: 'Sobre Mim', Content: About },
  { id: 'resume', label: 'Resumo', title: 'Resumo', Content: Resume },
  { id: 'projects', label: 'Projetos', title: 'Projetos', Content: Projects },
];

function MainCard() {
  const [selectedOptionId, setSelectedOptionId] = useState(NAVBAR_OPTIONS[0].id);
  const { title, Content } = NAVBAR_OPTIONS.find(({ id }) => id === selectedOptionId);

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
                onClick={ () => setSelectedOptionId(id) }
              >
                { label }
              </button>
            </div>
          ))
        }
      </nav>
      {/* A "key" recria o card a cada troca de aba, reiniciando a animação e a rolagem */}
      <article key={ selectedOptionId } className="article-main-card quick-animation">
        <section className="section-nav-options-title">
          <h2 className="h2-title">
            { title }
            <hr className="bottom-hr-title" />
          </h2>
        </section>

        <section className="content-render-section">
          <Content />
        </section>
      </article>
    </>
  );
}

export default MainCard;
