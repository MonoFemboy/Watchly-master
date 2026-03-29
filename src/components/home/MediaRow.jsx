import React from 'react';
import { motion } from 'framer-motion';
import Card from '../media/Card';
import './MediaRow.css';

export default function MediaRow({
  title,
  rowKey,
  items,
  type,
  scrollRefs,
  onScroll,
  rowMotion,
}) {
  return (
    <motion.div className="media-row section" {...rowMotion}>
      <h2 className="media-row__title">{title}</h2>
      <button
        type="button"
        className="media-row__scroll media-row__scroll--left"
        onClick={() => onScroll(rowKey, 'left')}
        aria-label={`Scroll ${title} left`}
      >
        ‹
      </button>
      <button
        type="button"
        className="media-row__scroll media-row__scroll--right"
        onClick={() => onScroll(rowKey, 'right')}
        aria-label={`Scroll ${title} right`}
      >
        ›
      </button>
      <div
        className="media-row__track scroll-container"
        ref={(el) => {
          scrollRefs.current[rowKey] = el;
        }}
      >
        {items.map((item) => (
          <Card key={item.id} item={item} type={type} />
        ))}
      </div>
    </motion.div>
  );
}
