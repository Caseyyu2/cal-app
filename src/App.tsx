import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { ActivityProvider } from './context/ActivityContext';
import './App.css';

function App() {
  return (
    <ActivityProvider>
      <div className="app">
        <Suspense fallback={<div className="loading">Loading activities...</div>}>
          <Outlet />
        </Suspense>
      </div>
    </ActivityProvider>
  );
}

export default App;
