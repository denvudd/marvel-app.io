import { useState } from 'react';

import './banner.scss';

import avengers from '../../resources/img/Avengers.png';
import avengersLogo from '../../resources/img/Avengers_logo.png';

const Banner = () => {
  return (
    <div className="banner">
      <div className="banner-container">
        <div className="banner-avengers">
          <div className="banner-avengers__img">
            <img src={avengers} alt="" />
          </div>
          <div className="banner-avengers__text">
            <p>New comics every week!</p>
            <p>Stay tuned!</p>
        </div>
        </div>
        <div className="banner__logo">
          <img src={avengersLogo} alt="" />
        </div>
      </div>
    </div>
  )
}

export default Banner;
