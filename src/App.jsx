import { useState, useEffect, useRef } from 'react';
import './App.css';

function BreathingCircle({ duration = 4000 }) {
  const [phase, setPhase] = useState('inhale');
  const [progress, setProgress] = useState(0);
  const requestRef = useRef();
  const startTime = useRef();

  useEffect(() => {
    let animationFrame;
    function animateBreath(ts) {
      if (!startTime.current) startTime.current = ts;
      const elapsed = ts - startTime.current;
      let percent = Math.min(elapsed / duration, 1);
      setProgress(percent);
      if (percent < 1) {
        animationFrame = requestAnimationFrame(animateBreath);
      } else {
        setPhase((prev) => (prev === 'inhale' ? 'exhale' : 'inhale'));
        setProgress(0);
        startTime.current = null;
      }
    }
    animationFrame = requestAnimationFrame(animateBreath);
    return () => cancelAnimationFrame(animationFrame);
  }, [phase, duration]);

  // Circle size animates between 60px and 180px
  const min = 60, max = 180;
  const size = phase === 'inhale'
    ? min + (max - min) * progress
    : max - (max - min) * progress;

  return (
    <div className="breath-container">
      <div className="breath-circle-wrapper">
        <div
          className="breath-circle"
          style={{ width: size, height: size }}
        />
      </div>
      <div className="breath-label">{phase === 'inhale' ? '吸气' : '呼气'}</div>
    </div>
  );
}

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
      <BreathingCircle duration={4000} />
      <MindfulnessTimer initial={60} />
    </div>
  );
}

export default App;
