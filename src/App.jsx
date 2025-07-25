import { useState, useEffect, useRef } from 'react';
import './App.css';
import SiriBreathingOrb from './components/SiriBreathingOrb.jsx';

function MindfulnessTimer({ initial = 60 }) {
  const [seconds, setSeconds] = useState(initial);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    if (seconds === 0) return;
    const timer = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [running, seconds]);
  const min = String(Math.floor(seconds / 60)).padStart(2, '0');
  const sec = String(seconds % 60).padStart(2, '0');
  return (
    <div className="timer-container">
      <div className="timer-display">{min}:{sec}</div>
      <button className="timer-btn" onClick={() => setRunning(r => !r)}>
        {running ? '暂停' : '开始'}
      </button>
      <button className="timer-btn" onClick={() => { setSeconds(initial); setRunning(false); }}>
        重置
      </button>
    </div>
  );
}



function App() {
  return (
    <div className="watch-bg ">
      <h2 className="app-title">正念冥想</h2>
      <SiriBreathingOrb duration={4000} />
      <MindfulnessTimer initial={60} />
    </div>
  );
}

export default App;
