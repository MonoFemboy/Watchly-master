import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { getDisplayTitle, getHeroBackdropUrl, getOverviewSnippet } from '../../utils/mediaImages';
import { EASE_OUT } from '../../constants/motion';
import './HeroBanner.css';

export default function HeroBanner({ featured, type, typeLabel }) {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const bg = getHeroBackdropUrl(featured);
  const title = getDisplayTitle(featured) || 'Watchly';
  const synopsis = featured ? getOverviewSnippet(featured) : '';

  const motionProps = reduceMotion
    ? { initial: false }
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: EASE_OUT },
      };

  const goDetails = () => {
    if (!featured?.id) return;
    navigate(`/details/${type}/${featured.id}`);
  };

  return (
    <motion.section className="hero-banner" {...motionProps}>
      <div className="hero-banner__bg" aria-hidden>
        {bg ? (
          <img src={bg} alt="" className="hero-banner__bg-img" />
        ) : null}
        <div className="hero-banner__vignette" />
        <div className="hero-banner__fade-bottom" />
      </div>

      <div className="hero-banner__content">
        <p className="hero-banner__eyebrow">{typeLabel}</p>
        <h1 className="hero-banner__title">{title}</h1>
        {synopsis ? <p className="hero-banner__synopsis">{synopsis}</p> : null}
        <div className="hero-banner__actions">
          <button
            type="button"
            className="hero-banner__btn hero-banner__btn--primary"
            onClick={goDetails}
            disabled={!featured?.id}
          >
            ▶ More info
          </button>
          <button
            type="button"
            className="hero-banner__btn hero-banner__btn--ghost"
            onClick={() => navigate('/my-list')}
          >
            My List
          </button>
        </div>
      </div>
    </motion.section>
  );
}
