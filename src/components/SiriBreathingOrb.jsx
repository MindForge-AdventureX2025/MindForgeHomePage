import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './SiriBreathingOrb.css';

function SiriBreathingOrb({ duration = 4000 }) {
  const [phase, setPhase] = useState('inhale');
  const [progress, setProgress] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const requestRef = useRef();
  const startTime = useRef();
  const cycleCountRef = useRef(0); // 使用 ref 避免重复触发

  // Siri风格的颜色组合 - 更自然的渐变色彩
  const colorSchemes = [
    {
      primary: '#667eea', // 柔和靛蓝
      secondary: '#764ba2', // 温和紫色
      tertiary: '#f093fb', // 粉紫色
      name: '宁静蓝紫'
    },
    {
      primary: '#4facfe', // 天空蓝
      secondary: '#00f2fe', // 青蓝色
      tertiary: '#43e97b', // 清新绿
      name: '海洋蓝绿'
    },
    {
      primary: '#fa709a', // 玫瑰粉
      secondary: '#fee140', // 温暖黄
      tertiary: '#fa8072', // 珊瑚色
      name: '暖阳珊瑚'
    },
    {
      primary: '#a8edea', // 薄荷绿
      secondary: '#fed6e3', // 淡粉色
      tertiary: '#d299c2', // 薰衣草
      name: '薄荷薰衣'
    },
    {
      primary: '#ffecd2', // 香草色
      secondary: '#fcb69f', // 桃色
      tertiary: '#ff8a80', // 活珊瑚
      name: '日落桃'
    },
    {
      primary: '#84fab0', // 翡翠绿
      secondary: '#8fd3f4', // 天蓝色
      tertiary: '#a8c8ec', // 淡蓝紫
      name: '翡翠天空'
    }
  ];

  const currentColors = colorSchemes[colorIndex];
  const nextColors = colorSchemes[(colorIndex + 1) % colorSchemes.length];

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
        const newPhase = phase === 'inhale' ? 'exhale' : 'inhale';
        setPhase(newPhase);
        
        // 只在完成一个完整的吸气+呼气循环后切换颜色
        if (newPhase === 'inhale') {
          cycleCountRef.current++;
          const newColorIndex = cycleCountRef.current % colorSchemes.length;
          if (newColorIndex !== colorIndex) {
            setIsTransitioning(true);
            setTimeout(() => {
              setColorIndex(newColorIndex);
              setIsTransitioning(false);
            }, 200);
          }
        }
        
        setProgress(0);
        startTime.current = null;
      }
    }
    animationFrame = requestAnimationFrame(animateBreath);
    return () => cancelAnimationFrame(animationFrame);
  }, [phase, duration, colorSchemes.length, colorIndex]);

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
            background: `radial-gradient(circle, ${currentColors.tertiary}20 0%, transparent 70%)`,
            transition: isTransitioning ? 'background 0.8s ease-in-out' : 'none'
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
            background: `radial-gradient(circle, ${currentColors.secondary}30 0%, transparent 60%)`,
            transition: isTransitioning ? 'background 0.8s ease-in-out' : 'none'
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
            `,
            transition: isTransitioning ? 'background 0.8s ease-in-out, box-shadow 0.8s ease-in-out' : 'none'
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
              `,
              transition: isTransitioning ? 'background 0.8s ease-in-out' : 'none'
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
