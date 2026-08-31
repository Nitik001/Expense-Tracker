import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import Home from './views/Home';
import Report from './views/Report';
import Plan from './views/Plan';
import { FinanceProvider } from './context/FinanceContext';
import './App.css';

function App() {
  return (
    <FinanceProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="report" element={<Report />} />
            <Route path="plan" element={<Plan />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </FinanceProvider>
  );
}

export default App;
