// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import Navbar from './components/Navbar';
import MediaGrid from './components/MediaGrid';
import WatchPage from './components/WatchPage';
import MediaDetailPage from './components/MediaDetailPage';
import MyList from './pages/MyList';
import Dashboard from './pages/Dashboard';
import './App.css';

const MainContent = () => {
  const location = useLocation();
  const [params] = useSearchParams();
  const type = params.get('type') || 'movie';
  const reduceMotion = useReducedMotion();

  return (
    <>
      <Navbar />

      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname + type}
          className="motion-wrapper"
          initial={{ opacity: reduceMotion ? 1 : 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: reduceMotion ? 1 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.32, ease: [0.4, 0, 0.2, 1] }}
        >
          <Routes location={location}>
            <Route path="/" element={<MediaGrid type={type} />} />
            <Route path="/my-list" element={<MyList />} />
            <Route path="/watch/:type/:id/:season?/:episode?" element={<WatchPage />} />
            <Route path="/details/:type/:id" element={<MediaDetailPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}
