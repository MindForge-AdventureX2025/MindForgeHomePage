import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './SiriBreathingOrb.css';

function SiriBreathingOrb({ duration = 4000 }) {
  const [phase, setPhase] = useState('inhale');
  const [progress, setProgress] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const [colorTransitionProgress, setColorTransitionProgress] = useState(0);
  const requestRef = useRef();
  const startTime = useRef();
  const phaseCountRef = useRef(0);
  const colorStartTimeRef = useRef(null); // 颜色过渡的独立计时器
  const colorDuration = 8000; // 颜色过渡持续8秒

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
  
  // 颜色混合函数
  const mixColors = (color1, color2, ratio) => {
    if (ratio === 0) return color1;
    if (ratio === 1) return color2;
    
    const hex1 = color1.replace('#', '');
    const hex2 = color2.replace('#', '');
    
    const r1 = parseInt(hex1.substr(0, 2), 16);
    const g1 = parseInt(hex1.substr(2, 2), 16);
    const b1 = parseInt(hex1.substr(4, 2), 16);
    
    const r2 = parseInt(hex2.substr(0, 2), 16);
    const g2 = parseInt(hex2.substr(2, 2), 16);
    const b2 = parseInt(hex2.substr(4, 2), 16);
    
    const r = Math.round(r1 + (r2 - r1) * ratio);
    const g = Math.round(g1 + (g2 - g1) * ratio);
    const b = Math.round(b1 + (b2 - b1) * ratio);
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };
  
  // 混合后的显示颜色，使用独立的颜色过渡进度
  const displayColors = {
    primary: mixColors(currentColors.primary, nextColors.primary, colorTransitionProgress),
    secondary: mixColors(currentColors.secondary, nextColors.secondary, colorTransitionProgress),
    tertiary: mixColors(currentColors.tertiary, nextColors.tertiary, colorTransitionProgress),
    name: colorTransitionProgress < 0.5 ? currentColors.name : nextColors.name
  };

  useEffect(() => {
    let animationFrame;
    
    function animateBreath(ts) {
      if (!startTime.current) startTime.current = ts;
      if (!colorStartTimeRef.current) colorStartTimeRef.current = ts;
      
      // 呼吸动画进度
      const breathElapsed = ts - startTime.current;
      let breathPercent = Math.min(breathElapsed / duration, 1);
      setProgress(breathPercent);
      
      // 颜色过渡进度（独立计时）
      const colorElapsed = ts - colorStartTimeRef.current;
      let colorPercent = Math.min(colorElapsed / colorDuration, 1);
      setColorTransitionProgress(colorPercent);
      
      // 呼吸相位完成
      if (breathPercent >= 1) {
        phaseCountRef.current++;
        const newPhase = phase === 'inhale' ? 'exhale' : 'inhale';
        console.log('Phase:', phaseCountRef.current, phase, '->', newPhase);
        
        setPhase(newPhase);
        setProgress(0);
        startTime.current = null;
      }
      
      // 颜色过渡完成
      if (colorPercent >= 1) {
        const newColorIndex = (colorIndex + 1) % colorSchemes.length;
        console.log('Color transition completed:', colorIndex, '->', newColorIndex);
        setColorIndex(newColorIndex);
        setColorTransitionProgress(0);
        colorStartTimeRef.current = null;
      }
      
      animationFrame = requestAnimationFrame(animateBreath);
    }
    
    animationFrame = requestAnimationFrame(animateBreath);
    return () => cancelAnimationFrame(animationFrame);
  }, [phase, duration, colorIndex, colorSchemes.length]);

  // 计算缩放比例 (0.8 到 1.4) - 实时跟随呼吸进度
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
        <div
          className="siri-glow-ring outer"
          style={{
            transform: `scale(${scale * 1.6})`,
            opacity: glowIntensity * 0.4,
            background: `radial-gradient(circle, ${displayColors.tertiary}20 0%, transparent 70%)`
          }}
        />
        
        {/* 中层光晕环 */}
        <div
          className="siri-glow-ring middle"
          style={{
            transform: `scale(${scale * 1.3})`,
            opacity: glowIntensity * 0.6,
            background: `radial-gradient(circle, ${displayColors.secondary}30 0%, transparent 60%)`
          }}
        />
        
        {/* 主体球 */}
        <div
          className="siri-main-orb"
          style={{
            transform: `scale(${scale})`,
            background: `
              radial-gradient(
                circle at 30% 30%, 
                ${displayColors.primary}ff 0%, 
                ${displayColors.secondary}cc 40%, 
                ${displayColors.tertiary}88 70%,
                transparent 100%
              )
            `,
            boxShadow: `
              0 0 ${60 * glowIntensity}px ${displayColors.primary}66,
              0 0 ${100 * glowIntensity}px ${displayColors.secondary}44,
              0 0 ${140 * glowIntensity}px ${displayColors.tertiary}22,
              inset 0 0 40px ${displayColors.primary}33
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
                  ${displayColors.primary}40 0deg,
                  ${displayColors.secondary}60 120deg,
                  ${displayColors.tertiary}40 240deg,
                  ${displayColors.primary}40 360deg
                )
              `
            }}
          />
          
          {/* 高光效果 */}
          <div className="siri-highlight" />
        </div>
        
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
                x: Math.cos(i * 60 * Math.PI / 180) * 100 * scale,
                y: Math.sin(i * 60 * Math.PI / 180) * 100 * scale,
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
      
      <div className="siri-breath-label">
        <motion.span 
          className="phase-text"
          animate={{
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: duration / 1000,
            ease: "easeInOut"
          }}
        >
          {phase === 'inhale' ? '吸气' : '呼气'}
        </motion.span>
        <AnimatePresence mode="wait">
          <motion.span 
            className="color-name"
            key={`${colorIndex}-${displayColors.name}`} // 使用颜色名称作为key
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {displayColors.name}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default SiriBreathingOrb;
