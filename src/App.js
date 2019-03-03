import React from 'react';
import imageSrc from '../public/asserts/bg.jpg';
import './App.css';

const App = () => {
  return (
    <div className="app">
      Hello React!
      <button type="submit">Click</button>
      <img src={imageSrc} alt="" />
    </div>
  );
};

export default App;
