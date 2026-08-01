import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout({ children, currentView, onNavigate }) {
  return (
    <div className="app-container">
      <Sidebar currentView={currentView} onNavigate={onNavigate} />
      <div className="main-content">
        <Header />
        <main className="workspace">
          {children}
        </main>
      </div>
    </div>
  );
}
