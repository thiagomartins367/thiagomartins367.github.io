import { useEffect, useState } from 'react';
import { FIVE_HUNDRED } from '../../constants';
import data from '../../database/data.json';
import './index.css';

function Profile() {
  const { profile } = data;
  const [isMoreInfoOpen, setIsMoreInfoOpen] = useState(false);
  const [isMoreInfoItemsVisible, setIsMoreInfoItemsVisible] = useState(false);

  useEffect(() => {
    if (!isMoreInfoOpen) return undefined;
    const timeoutId = setTimeout(() => setIsMoreInfoItemsVisible(true), FIVE_HUNDRED);
    return () => {
      clearTimeout(timeoutId);
      setIsMoreInfoItemsVisible(false);
    };
  }, [isMoreInfoOpen]);

  const profileTransitionMoreInfo = isMoreInfoOpen
    ? 'transition-profile-more-info' : '';
  const profileItemTransitionMoreInfo = isMoreInfoOpen && isMoreInfoItemsVisible
    ? 'transition-profile-item-more-info' : '';

  return (
    <aside className="aside-profile">
      <section className="section-profile-info">
        <div className="div-profile-picture">
          <img src={ profile.picture } alt="imagem de perfil" />
        </div>
        <div className="profile-info-content">
          <div className="div-profile-name">
            { profile.myName }
          </div>
          <div className="div-profile-title">
            { profile.title }
          </div>
        </div>
        <div>
          <button
            type="button"
            className="button-menu-mobile-platforms"
            aria-expanded={ isMoreInfoOpen }
            onClick={ () => setIsMoreInfoOpen(!isMoreInfoOpen) }
          >
            <span>More Info</span>
            <img src="/assets/down-arrow-menu.svg" alt="More Info" />
          </button>
        </div>
      </section>

      <section className={ `section-profile-more-info ${profileTransitionMoreInfo}` }>
        {
          profile.contacts.map((contactObj) => (
            <div
              key={ contactObj.name }
              className={ `div-profile-icon ${profileItemTransitionMoreInfo}` }
            >
              <a href={ contactObj.url } target="_blank" rel="noreferrer">
                <div className="div-img-icon">
                  <img
                    className="profile-icons"
                    src={ contactObj.image }
                    alt={ contactObj.name }
                  />
                </div>
              </a>
              <div className="div-profile-info">
                <div>
                  { contactObj.name.toUpperCase() }
                </div>
                <a href={ contactObj.url } target="_blank" rel="noreferrer">
                  { contactObj.username }
                </a>
              </div>
            </div>
          ))
        }
        {
          profile.otherInformations.map((contactObj) => (
            <div
              key={ contactObj.name }
              className={ `div-profile-icon ${profileItemTransitionMoreInfo}` }
            >
              <a href={ contactObj.url } target="_self" rel="noreferrer">
                <div className="div-img-icon">
                  <img
                    className="profile-icons"
                    src={ contactObj.image }
                    alt={ contactObj.name }
                  />
                </div>
              </a>
              <div className="div-profile-info">
                <div>
                  { contactObj.name.toUpperCase() }
                </div>
                <a href={ contactObj.url } target="_self" rel="noreferrer">
                  { contactObj.subtitle }
                </a>
              </div>
            </div>
          ))
        }
      </section>
    </aside>
  );
}

export default Profile;
