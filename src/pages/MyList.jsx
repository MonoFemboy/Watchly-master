import React, { useState, useEffect, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Card from '../components/media/Card';
import { getWatchlist } from '../utils/watchlist';
import { EASE_OUT } from '../constants/motion';
import './MyList.css';

const MyList = () => {
  const reduceMotion = useReducedMotion();
  const [items, setItems] = useState([]);

  const refresh = useCallback(() => {
    setItems(getWatchlist());
  }, []);

  useEffect(() => {
    refresh();
    const onUpdate = () => refresh();
    window.addEventListener('watchlist-updated', onUpdate);
    window.addEventListener('storage', onUpdate);
    return () => {
      window.removeEventListener('watchlist-updated', onUpdate);
      window.removeEventListener('storage', onUpdate);
    };
  }, [refresh]);

  const headerMotion = reduceMotion
    ? { initial: false }
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.38, ease: EASE_OUT },
      };

  const contentMotion = reduceMotion
    ? { initial: false }
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.35, delay: 0.06, ease: EASE_OUT },
      };

  return (
    <div className="my-list-page">
      <motion.h1 className="my-list-heading" {...headerMotion}>
        My List
      </motion.h1>
      {items.length === 0 ? (
        <motion.p className="my-list-empty" {...contentMotion}>
          Your list is empty. Save shows and films by clicking the star on a poster.
        </motion.p>
      ) : (
        <motion.div
          className="my-list-row"
          {...(reduceMotion
            ? { initial: false }
            : {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                transition: { duration: 0.35, ease: EASE_OUT },
              })}
        >
          {items.map((item) => (
            <Card
              key={`${item.type}-${item.id}`}
              item={item}
              type={item.type || 'movie'}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default MyList;
