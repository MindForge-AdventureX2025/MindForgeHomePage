import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './SiriBreathingOrb.css';

function SiriBreathingOrb({ duration = 4000 }) {
  const [phase, setPhase] = useState('inhale');
  const [progress, setProgress] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const requestRef = useRef();
  const startTime = useRef();

  // Siri风格的颜色组合
  const colorSchemes = [
    {
      primary: '#6366f1', // indigo
      secondary: '#8b5cf6', // violet
      tertiary: '#ec4899', // pink
      name: '宁静蓝'
    },
    {
      primary: '#10b981', // emerald
      secondary: '#06b6d4', // cyan
      tertiary: '#3b82f6', // blue
      name: '清新绿'
    },
    {
      primary: '#f59e0b', // amber
      secondary: '#ef4444', // red
      tertiary: '#ec4899', // pink
      name: '暖阳橙'
    },
    {
      primary: '#8b5cf6', // violet
      secondary: '#06b6d4', // cyan
      tertiary: '#10b981', // emerald
      name: '梦幻紫'
    }
  ];

  const currentColors = colorSchemes[colorIndex];

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
        setPhase((prev) => {
          const newPhase = prev === 'inhale' ? 'exhale' : 'inhale';
          // 每完成一个呼吸循环切换颜色
          if (newPhase === 'inhale') {
            setColorIndex((prevIndex) => (prevIndex + 1) % colorSchemes.length);
          }
          return newPhase;
        });
        setProgress(0);
        startTime.current = null;
      }
    }
    animationFrame = requestAnimationFrame(animateBreath);
    return () => cancelAnimationFrame(animationFrame);
  }, [phase, duration, colorSchemes.length]);

  // 计算缩放比例 (0.8 到 1.4)
  const scaleMin = 0.8, scaleMax = 1.4;
  const scale = phase === 'inhale'
    ? scaleMin + (scaleMax - scaleMin) * progress
    : scaleMax - (scaleMax - scaleMin) * progress;

  // 光晕强度随呼吸变化
  const glowIntensity = phase === 'inhale' 
    ? 0.3 + 0.7 * progress 
    : 1 - 0.7 * progress;

  return (
    <div className="siri-breath-container">
      <div className="siri-orb-wrapper">
        {/* 外层光晕环 */}
        <motion.div
          className="siri-glow-ring outer"
          animate={{
            scale: scale * 1.6,
            opacity: glowIntensity * 0.4
          }}
          transition={{
            duration: duration / 1000,
            ease: "easeInOut"
          }}
          style={{
            background: `radial-gradient(circle, ${currentColors.tertiary}20 0%, transparent 70%)`
          }}
        />
        
        {/* 中层光晕环 */}
        <motion.div
          className="siri-glow-ring middle"
          animate={{
            scale: scale * 1.3,
            opacity: glowIntensity * 0.6
          }}
          transition={{
            duration: duration / 1000,
            ease: "easeInOut"
          }}
          style={{
            background: `radial-gradient(circle, ${currentColors.secondary}30 0%, transparent 60%)`
          }}
        />
        
        {/* 主体球 */}
        <motion.div
          className="siri-main-orb"
          animate={{
            scale: scale,
          }}
          transition={{
            duration: duration / 1000,
            ease: "easeInOut"
          }}
          style={{
            background: `
              radial-gradient(
                circle at 30% 30%, 
                ${currentColors.primary}ff 0%, 
                ${currentColors.secondary}cc 40%, 
                ${currentColors.tertiary}88 70%,
                transparent 100%
              )
            `,
            boxShadow: `
              0 0 ${60 * glowIntensity}px ${currentColors.primary}66,
              0 0 ${100 * glowIntensity}px ${currentColors.secondary}44,
              0 0 ${140 * glowIntensity}px ${currentColors.tertiary}22,
              inset 0 0 40px ${currentColors.primary}33
            `
          }}
        >
          {/* 内部流动效果 */}
          <div 
            className="siri-flow-layer"
            style={{
              background: `
                conic-gradient(
                  from ${progress * 360}deg,
                  ${currentColors.primary}40 0deg,
                  ${currentColors.secondary}60 120deg,
                  ${currentColors.tertiary}40 240deg,
                  ${currentColors.primary}40 360deg
                )
              `
            }}
          />
          
          {/* 高光效果 */}
          <div className="siri-highlight" />
        </motion.div>
        
        {/* 粒子效果 */}
        <AnimatePresence>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`particle-${i}-${colorIndex}`}
              className="siri-particle"
              initial={{ 
                scale: 0, 
                opacity: 0,
                x: 0,
                y: 0
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, glowIntensity * 0.8, 0],
                x: Math.cos(i * 60 * Math.PI / 180) * 120 * scale,
                y: Math.sin(i * 60 * Math.PI / 180) * 120 * scale,
              }}
              transition={{
                duration: duration / 1000,
                ease: "easeInOut",
                delay: i * 0.1
              }}
              style={{
                background: colorSchemes[(colorIndex + i) % colorSchemes.length].primary
              }}
            />
          ))}
        </AnimatePresence>
      </div>
      
      <motion.div 
        className="siri-breath-label"
        animate={{
          opacity: [0.7, 1, 0.7],
          scale: [0.95, 1, 0.95]
        }}
        transition={{
          duration: duration / 1000,
          ease: "easeInOut"
        }}
      >
        <span className="phase-text">{phase === 'inhale' ? '吸气' : '呼气'}</span>
        <span className="color-name">{currentColors.name}</span>
      </motion.div>
    </div>
  );
}

export default SiriBreathingOrb;
