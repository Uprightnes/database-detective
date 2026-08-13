import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CasesPage from './pages/CasesPage';
import GamePage from './pages/GamePage';
import SolvedPage from './pages/SolvedPage';
import HowToPlayPage from './pages/HowToPlayPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/cases" element={<CasesPage />} />
        <Route path="/case/:id" element={<GamePage />} />
        <Route path="/case/:id/solved" element={<SolvedPage />} />
        <Route path="/how-to-play" element={<HowToPlayPage />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
