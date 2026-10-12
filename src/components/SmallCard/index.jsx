import React from 'react';
import PropTypes from 'prop-types';
import './index.css';

function SmallCard({
  cardTitle,
  imagePath,
  imageAltText,
  redirectLink = '',
  isHighlighted = false,
  onMouseEnter = undefined,
  onMouseLeave = undefined,
}) {
  return (
    <a
      href={ redirectLink }
      target="_blank"
      rel="noreferrer"
      onMouseEnter={ onMouseEnter }
      onMouseLeave={ onMouseLeave }
    >
      <div className={ `skill ${isHighlighted ? 'skill-highlighted' : ''}` }>
        <img
          src={ imagePath }
          alt={ imageAltText }
          className="skill-img"
        />
        <span className="card-title">{ cardTitle }</span>
      </div>
    </a>
  );
}

SmallCard.propTypes = {
  cardTitle: PropTypes.string.isRequired,
  imagePath: PropTypes.string.isRequired,
  imageAltText: PropTypes.string.isRequired,
  redirectLink: PropTypes.string,
  isHighlighted: PropTypes.bool,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
};

export default SmallCard;
