import React, { useState, useEffect, useRef } from 'react';
import './Focus.css';
import { useAppContext } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';

const RING_CIRCUMFERENCE = 565.48; // 2 * PI * 90
const DEFAULT_MINUTES = 25;

export const Focus: React.FC = () => {
  const { setXp } = useAppContext();
  const { showToast } = useToast();

  const [duration, setDuration] = useState(DEFAULT_MINUTES * 60);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_MINUTES * 60);
  const [isRunning, setIsRunning] = useState(false);

  const timerRef = useRef<number | null>(null);

  // Initialize from localStorage
  useEffect(() => {
    const savedEndTime = localStorage.getItem('focus_end_time');
    const savedDuration = localStorage.getItem('focus_duration');
    
    if (savedEndTime && savedDuration) {
      const endTimestamp = parseInt(savedEndTime, 10);
      const now = Date.now();
      
      if (endTimestamp > now) {
        setDuration(parseInt(savedDuration, 10));
        setTimeLeft(Math.ceil((endTimestamp - now) / 1000));
        setIsRunning(true);
      } else {
        // If timer finished while user was away
        localStorage.removeItem('focus_end_time');
        localStorage.removeItem('focus_duration');
      }
    }
  }, []);

  // Timer loop
  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const handleStart = () => {
    if (isRunning) return;
    const endTimestamp = Date.now() + timeLeft * 1000;
    localStorage.setItem('focus_end_time', endTimestamp.toString());
    localStorage.setItem('focus_duration', duration.toString());
    setIsRunning(true);
  };

  const handlePause = () => {
    if (!isRunning) return;
    setIsRunning(false);
    localStorage.removeItem('focus_end_time'); // Clear end time so it doesn't continue in bg
  };

  const handleReset = () => {
    handlePause();
    setTimeLeft(duration);
  };

  const handleSetDuration = (minutes: number) => {
    handlePause();
    const secs = minutes * 60;
    setDuration(secs);
    setTimeLeft(secs);
  };

  const handleComplete = () => {
    setIsRunning(false);
    localStorage.removeItem('focus_end_time');
    localStorage.removeItem('focus_duration');
    
    // Reward XP
    setXp((prev) => prev + 5);
    
    // Play sound / fireworks optionally
    // celebrate();
    
    showToast("Focus session complete! +5 XP earned.", "success");
    setTimeLeft(duration); // reset for next
  };

  // UI calculations
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeString = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  
  const ratio = duration > 0 ? timeLeft / duration : 0;
  const strokeDashoffset = RING_CIRCUMFERENCE - (RING_CIRCUMFERENCE * ratio);

  return (
    <div className="fade-in">
      <div className="dashboard-header" style={{ marginBottom: '24px' }}>
        <div>
          <h1>⏱ Focus Timer</h1>
          <p>Stay focused and complete your Pomodoro sessions to gain XP</p>
        </div>
      </div>

      <div className="card settings-card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '40px 24px' }}>
        <div className="focus-timer-container">
          <svg className="progress-ring" width="220" height="220">
            <circle className="ring-bg" cx="110" cy="110" r="90"></circle>
            <circle 
              className="ring-progress" 
              cx="110" 
              cy="110" 
              r="90" 
              style={{ strokeDashoffset }}
            ></circle>
          </svg>
          <div className="focus-timer-text">
            <h2>{timeString}</h2>
            <p>{isRunning ? 'Focusing...' : 'Time to focus'}</p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', margin: '30px 0' }}>
          {!isRunning ? (
            <button className="btn" style={{ background: 'linear-gradient(135deg, #a855f7, #8b5cf6)', padding: '12px 30px', fontSize: '1.1rem', borderRadius: '50px' }} onClick={handleStart}>
              ▶ Start
            </button>
          ) : (
            <button className="btn outline" style={{ padding: '12px 30px', fontSize: '1.1rem', borderRadius: '50px' }} onClick={handlePause}>
              ⏸ Pause
            </button>
          )}
          <button className="btn outline" style={{ padding: '12px 30px', fontSize: '1.1rem', borderRadius: '50px' }} onClick={handleReset}>
            ↩ Reset
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {[25, 50, 15, 5].map((mins) => (
            <button 
              key={mins}
              type="button" 
              className={`btn outline ${duration === mins * 60 ? 'is-active' : ''}`}
              style={{ 
                padding: '8px 16px', 
                borderRadius: '8px',
                borderColor: duration === mins * 60 ? 'var(--primary-color)' : 'var(--border-color)',
                color: duration === mins * 60 ? 'var(--primary-color)' : 'var(--text-color)'
              }}
              onClick={() => handleSetDuration(mins)}
            >
              {mins} Min
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
