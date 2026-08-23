import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const AnimatedBackground = () => {
  const canvasRef = useRef(null);
  const { isDark } = useTheme();
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates with smoothing for magnetic interaction
    let mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      active: false,
    };

    let scrollY = window.scrollY || 0;

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.targetX = width / 2;
      mouse.targetY = height / 2;
    };

    const handleScroll = () => {
      scrollY = window.scrollY || 0;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    // 1. Color Palettes across Purple - Indigo - Violet - Pink/Fuchsia spectrum
    // Calibrated distinctly for Light vs Dark modes for perfect contrast & depth
    const palette = isDark
      ? {
          // Dark Mode: Luminous Neon Glow
          smallColors: [
            'rgba(129, 140, 248, 0.45)', // Indigo-400
            'rgba(167, 139, 250, 0.45)', // Violet-400
            'rgba(192, 132, 252, 0.40)', // Purple-400
            'rgba(244, 114, 182, 0.35)', // Pink-400
          ],
          medColors: [
            'rgba(129, 140, 248, 0.75)', // Indigo-400
            'rgba(168, 85, 247, 0.75)',  // Purple-500
            'rgba(192, 132, 252, 0.80)', // Purple-400
            'rgba(236, 72, 153, 0.65)',  // Pink-500
          ],
          largeColors: [
            'rgba(167, 139, 250, 0.95)', // Violet-400
            'rgba(192, 132, 252, 0.95)', // Purple-400
            'rgba(244, 114, 182, 0.90)', // Pink-400
            'rgba(129, 140, 248, 0.95)', // Indigo-400
          ],
          lineBaseRgb: '147, 120, 250',
          maxLineOpacity: 0.18, // 18% in dark mode
          glowColor: 'rgba(168, 85, 247, 0.75)',
          glowBlur: 14,
        }
      : {
          // Light Mode: Saturated Crisp Rich Tones
          smallColors: [
            'rgba(79, 70, 229, 0.50)',   // Indigo-600
            'rgba(109, 40, 217, 0.50)',  // Violet-700
            'rgba(126, 34, 206, 0.45)',  // Purple-700
            'rgba(190, 24, 93, 0.40)',   // Pink-700
          ],
          medColors: [
            'rgba(67, 56, 202, 0.75)',   // Indigo-700
            'rgba(109, 40, 217, 0.78)',  // Violet-700
            'rgba(147, 51, 234, 0.75)',  // Purple-600
            'rgba(219, 39, 119, 0.70)',  // Pink-600
          ],
          largeColors: [
            'rgba(79, 70, 229, 0.95)',   // Indigo-600
            'rgba(124, 58, 237, 0.95)',  // Violet-600
            'rgba(168, 85, 247, 0.95)',  // Purple-500
            'rgba(225, 29, 72, 0.90)',   // Rose-600
          ],
          lineBaseRgb: '99, 102, 241',
          maxLineOpacity: 0.14, // 14% in light mode (crisp and visible)
          glowColor: 'rgba(124, 58, 237, 0.55)',
          glowBlur: 10,
        };

    // Particle count: 18-22 on mobile, 34-44 on desktop for optimal balance & readability
    const baseCount = isMobile ? 20 : Math.min(Math.floor((width * height) / 30000) + 16, 42);

    // Generate safe positions (avoiding high clutter over center hero text)
    const generatePosition = () => {
      let x, y, distToCenter;
      const centerX = width / 2;
      const centerY = height / 2;
      const safeRadius = Math.min(width, height) * 0.26;

      let attempts = 0;
      do {
        x = Math.random() * width;
        y = Math.random() * height;
        const dx = x - centerX;
        const dy = y - centerY;
        distToCenter = Math.sqrt(dx * dx + dy * dy);
        attempts++;
      } while (distToCenter < safeRadius && attempts < 8 && Math.random() > 0.35);

      return { x, y };
    };

    // 2. Particle Generation with 3 Distinct Size Categories
    // Tier 0: Small (radius 1px -> diameter 2px, subtle background depth)
    // Tier 1: Medium (radius 2px -> diameter 4px, standard constellation)
    // Tier 2: Large (radius 3-4px -> diameter 6-8px, foreground with rich purple glow shadow)
    const particles = [];

    for (let i = 0; i < baseCount; i++) {
      const pos = generatePosition();
      const rand = Math.random();

      let tier = 1;
      let baseRadius = 2.0; // Medium (4px diameter)
      let colorArray = palette.medColors;
      let parallaxFactor = 0.035;

      if (rand < 0.45) {
        // Tier 0: Small (2px diameter)
        tier = 0;
        baseRadius = 1.0;
        colorArray = palette.smallColors;
        parallaxFactor = 0.015;
      } else if (rand < 0.82) {
        // Tier 1: Medium (4px diameter)
        tier = 1;
        baseRadius = 2.0;
        colorArray = palette.medColors;
        parallaxFactor = 0.035;
      } else {
        // Tier 2: Large (6-8px diameter)
        tier = 2;
        baseRadius = Math.random() * 0.8 + 3.2; // 3.2 - 4.0px radius = 6.4 - 8px diameter
        colorArray = palette.largeColors;
        parallaxFactor = 0.065;
      }

      const color = colorArray[Math.floor(Math.random() * colorArray.length)];

      particles.push({
        baseX: pos.x,
        baseY: pos.y,
        x: pos.x,
        y: pos.y,
        vx: (Math.random() - 0.5) * (tier === 0 ? 0.15 : tier === 1 ? 0.24 : 0.32),
        vy: (Math.random() - 0.5) * (tier === 0 ? 0.15 : tier === 1 ? 0.24 : 0.32),
        radius: baseRadius,
        tier,
        color,
        parallaxFactor,
        pulseSpeed: Math.random() * 0.015 + 0.008,
        pulseVal: Math.random() * Math.PI * 2,
        driftAngle: Math.random() * Math.PI * 2,
        driftSpeed: (Math.random() - 0.5) * 0.006,
      });
    }

    const maxConnectionDistance = isMobile ? 130 : 175;

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const mouseDeltaX = (mouse.x - width / 2);
      const mouseDeltaY = (mouse.y - height / 2);

      // 1. Update Positions & Organic Drift
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!shouldReduceMotion) {
          // Organic curved drift
          p.driftAngle += p.driftSpeed;
          p.baseX += p.vx + Math.cos(p.driftAngle) * 0.1;
          p.baseY += p.vy + Math.sin(p.driftAngle) * 0.1;

          // Seamless boundary wraparound
          if (p.baseX < -30) p.baseX = width + 30;
          if (p.baseX > width + 30) p.baseX = -30;
          if (p.baseY < -30) p.baseY = height + 30;
          if (p.baseY > height + 30) p.baseY = -30;

          // Parallax offset
          const parallaxX = mouseDeltaX * p.parallaxFactor;
          const parallaxY = (mouseDeltaY + scrollY * 0.15) * p.parallaxFactor;

          // Interactive Magnetic Effect around cursor
          let magneticX = 0;
          let magneticY = 0;
          if (mouse.active) {
            const mdx = (p.baseX + parallaxX) - mouse.x;
            const mdy = (p.baseY + parallaxY) - mouse.y;
            const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
            const magneticRadius = 160;

            if (mDist < magneticRadius && mDist > 1) {
              const force = (1 - mDist / magneticRadius) * 14 * (p.tier + 1) * 0.35;
              magneticX = (mdx / mDist) * force;
              magneticY = (mdy / mDist) * force;
            }
          }

          p.x = p.baseX + parallaxX + magneticX;
          p.y = p.baseY + parallaxY + magneticY;
        }
      }

      // 2. Draw Constellation Connection Lines (1px, smooth fade in/out)
      ctx.shadowBlur = 0; // Ensure lines don't cost glow overhead
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectionDistance) {
            // Smooth ease fade in/out
            const fadeFactor = 1 - dist / maxConnectionDistance;
            const currentOpacity = Math.pow(fadeFactor, 1.4) * palette.maxLineOpacity;

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${palette.lineBaseRgb}, ${currentOpacity})`;
            ctx.lineWidth = 1.0;
            ctx.stroke();
          }
        }
      }

      // 3. Draw Particles (with Glowing Box/Radial Shadows on Large Points)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Pulse calculation
        p.pulseVal += p.pulseSpeed;
        const pulse = Math.sin(p.pulseVal);
        const currentRadius = Math.max(p.radius + pulse * (p.tier === 2 ? 0.5 : 0.25), 0.5);

        // Apply glow shadow to Large Tier particles (6-8px) in both modes
        if (p.tier === 2) {
          ctx.shadowColor = palette.glowColor;
          ctx.shadowBlur = palette.glowBlur;

          // Additional outer soft aura for large dots
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentRadius * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? 'rgba(168, 85, 247, 0.15)' : 'rgba(124, 58, 237, 0.12)';
          ctx.fill();
        } else if (p.tier === 1) {
          ctx.shadowColor = palette.glowColor;
          ctx.shadowBlur = isDark ? 6 : 3;
        } else {
          ctx.shadowBlur = 0;
        }

        // Main particle core
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      // Reset shadow for next tick
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark, isMobile, shouldReduceMotion]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* 1. Aurora Ambient Glow Orbs (Purple / Violet / Pink / Indigo Gradient Blobs) */}
      {/* Orb 1: Top-Left Violet-Indigo Blob */}
      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : {
                scale: [1, 1.18, 0.92, 1],
                x: [0, 35, -25, 0],
                y: [0, -30, 20, 0],
                opacity: isDark ? [0.28, 0.42, 0.30, 0.28] : [0.45, 0.62, 0.48, 0.45],
              }
        }
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-[12%] left-[6%] w-[540px] h-[540px] md:w-[800px] md:h-[800px] rounded-full blur-[110px] md:blur-[140px] pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(124, 58, 237, 0.45) 0%, rgba(99, 102, 241, 0.28) 45%, transparent 75%)'
            : 'radial-gradient(circle, rgba(196, 181, 253, 0.75) 0%, rgba(165, 180, 252, 0.55) 45%, rgba(224, 231, 255, 0.30) 70%, transparent 80%)',
        }}
      />

      {/* Orb 2: Bottom-Right Purple-Pink / Fuchsia Blob */}
      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : {
                scale: [1, 0.88, 1.15, 1],
                x: [0, -45, 30, 0],
                y: [0, 40, -25, 0],
                opacity: isDark ? [0.22, 0.36, 0.25, 0.22] : [0.40, 0.55, 0.44, 0.40],
              }
        }
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 3,
        }}
        className="absolute top-[26%] -right-[8%] w-[500px] h-[500px] md:w-[720px] md:h-[720px] rounded-full blur-[100px] md:blur-[130px] pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(219, 39, 119, 0.38) 0%, rgba(147, 51, 234, 0.25) 50%, transparent 78%)'
            : 'radial-gradient(circle, rgba(244, 114, 182, 0.60) 0%, rgba(216, 180, 254, 0.50) 50%, rgba(240, 171, 252, 0.25) 70%, transparent 80%)',
        }}
      />

      {/* Orb 3: Center-Right Floating Indigo-Purple Accent Blob */}
      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : {
                scale: [0.94, 1.12, 0.94],
                x: [0, 20, -15, 0],
                y: [0, -15, 25, 0],
                opacity: isDark ? [0.18, 0.28, 0.18] : [0.32, 0.46, 0.32],
              }
        }
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 5,
        }}
        className="absolute top-[12%] left-[32%] w-[440px] h-[380px] md:w-[640px] md:h-[540px] rounded-full blur-[120px] pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(99, 102, 241, 0.32) 0%, rgba(139, 92, 246, 0.18) 55%, transparent 72%)'
            : 'radial-gradient(circle, rgba(199, 210, 254, 0.65) 0%, rgba(233, 213, 255, 0.40) 50%, transparent 75%)',
        }}
      />

      {/* 2. Constellation Particles Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          opacity: 1,
        }}
      />

      {/* 3. Subtle Contrast & Vignette Layer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at 50% 30%, transparent 40%, rgba(11, 15, 23, 0.45) 90%)'
            : 'radial-gradient(ellipse at 50% 30%, transparent 50%, rgba(248, 249, 250, 0.25) 90%)',
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
