import { useState } from 'react';
import data from '../../database/data.json';
import './index.css';

function Profile() {
  const { profile } = data;
  const [isMoreInfoOpen, setIsMoreInfoOpen] = useState(false);
  const moreInfoItems = [
    ...profile.contacts
      .map((contact) => ({ ...contact, linkText: contact.username, target: '_blank' })),
    ...profile.otherInformations
      .map((info) => ({ ...info, linkText: info.subtitle, target: '_self' })),
  ];
  const moreInfoOpenClass = isMoreInfoOpen ? 'transition-profile-more-info' : '';

  return (
    <aside className="aside-profile">
      <section className="section-profile-info">
        <div className="div-profile-picture">
          <img src={ profile.picture } alt={ `Foto de ${profile.myName}` } />
        </div>
        <div className="profile-info-content">
          <h1 className="h1-profile-name">
            { profile.myName }
          </h1>
          <div className="div-profile-title">
            { profile.title }
          </div>
        </div>
        <div>
          <button
            type="button"
            className="button-menu-mobile-platforms"
            aria-label="Mais informações"
            aria-expanded={ isMoreInfoOpen }
            aria-controls="profile-more-info"
            onClick={ () => setIsMoreInfoOpen(!isMoreInfoOpen) }
          >
            <img src="/assets/down-arrow-menu.svg" alt="" />
          </button>
        </div>
      </section>

      <section
        id="profile-more-info"
        className={ `section-profile-more-info ${moreInfoOpenClass}` }
      >
        <div className="div-profile-more-info-content">
          {
            moreInfoItems.map(({ name, url, image, linkText, target }, index) => (
              <div
                key={ name }
                className="div-profile-icon"
                style={ { '--item-index': index } }
              >
                <a href={ url } target={ target } rel="noreferrer">
                  <div className="div-img-icon">
                    <img className="profile-icons" src={ image } alt={ name } />
                  </div>
                </a>
                <div className="div-profile-info">
                  <div>
                    { name.toUpperCase() }
                  </div>
                  <a href={ url } target={ target } rel="noreferrer">
                    { linkText }
                  </a>
                </div>
              </div>
            ))
          }
        </div>
      </section>
    </aside>
  );
}

export default Profile;
