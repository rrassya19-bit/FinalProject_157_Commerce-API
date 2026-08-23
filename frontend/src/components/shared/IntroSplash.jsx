import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';

const IntroSplash = () => {
  const [showSplash, setShowSplash] = useState(true);
  const { isDark } = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    // Hide splash after sequence completes (~1100ms)
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1150);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          key="intro-splash"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center pointer-events-none select-none overflow-hidden transition-colors"
          style={{
            backgroundColor: isDark ? '#0B0F17' : '#F8F9FA',
          }}
        >
          {/* Ambient Background Glow */}
          <div
            className="absolute w-[320px] h-[320px] sm:w-[480px] sm:h-[480px] rounded-full blur-[110px] pointer-events-none opacity-45 dark:opacity-35"
            style={{
              background: isDark
                ? 'radial-gradient(circle, rgba(124, 58, 237, 0.65) 0%, rgba(99, 102, 241, 0.25) 55%, transparent 75%)'
                : 'radial-gradient(circle, rgba(165, 180, 252, 0.85) 0%, rgba(196, 181, 253, 0.45) 55%, transparent 75%)',
            }}
          />

          {/* Master Sequence Container */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{
              duration: 0.45,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative flex flex-col items-center z-10"
          >
            {/* Logo Centerpiece with Precise Geometric Dashed Halo */}
            <div className="relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24">
              {/* Perfect Geometric Dashed Circular Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  repeat: Infinity,
                  duration: 3.2,
                  ease: 'linear',
                }}
                className="absolute inset-0 rounded-full border-[1.5px] border-dashed border-indigo-500/40 dark:border-indigo-400/35"
              />

              {/* Second subtle concentric outer glow ring */}
              <div className="absolute -inset-1.5 rounded-full border border-indigo-500/10 dark:border-indigo-400/10 pointer-events-none" />

              {/* Main Brand Squircle Icon */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-indigo-400 flex items-center justify-center text-white shadow-xl shadow-indigo-500/25 dark:shadow-indigo-500/35 ring-1 ring-white/20">
                <Layers className="w-8 h-8 sm:w-9 sm:h-9" />
              </div>
            </div>

            {/* Brand Title */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 text-center"
            >
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1A202C] dark:text-white">
                Commerce<span className="text-indigo-600 dark:text-indigo-400">API</span>
              </h1>
            </motion.div>

            {/* Microcopy Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="mt-1 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 tracking-wide text-center"
            >
              {t('splash.tagline')}
            </motion.p>

            {/* Staggered Bouncing / Pulsing 3-Dot Loading Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.38, duration: 0.3 }}
              className="flex items-center gap-1.5 mt-3 h-4"
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={{
                    y: [0, -5, 0],
                    scale: [0.85, 1.25, 0.85],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.75,
                    delay: i * 0.16,
                    ease: 'easeInOut',
                  }}
                  className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shadow-sm shadow-indigo-500/40"
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroSplash;
