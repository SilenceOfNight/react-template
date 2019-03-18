import React from 'react';
import image from '@/asserts/bg.jpg';
import './index.css';

const App = () => {
  return (
    <div className="app-container">
      <div className="app-sider">Sider</div>
      <div className="app-content">
        <img src={image} alt="Losing" />
      </div>
    </div>
  );
};

export default App;
