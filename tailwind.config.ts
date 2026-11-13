import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        space: {
          950: '#03050c',
          900: '#070b18',
          850: '#0c1226',
          800: '#111a36',
          700: '#1a274e',
          600: '#26386b',
        },
        cosmic: {
          cyan: '#38bdf8',
          blue: '#3b82f6',
          purple: '#a855f7',
          violet: '#8b5cf6',
          gold: '#f59e0b',
          amber: '#fbbf24',
          rose: '#f43f5e',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 30px -5px rgba(56, 189, 248, 0.25)',
        'glow-purple': '0 0 30px -5px rgba(168, 85, 247, 0.25)',
        'glow-gold': '0 0 30px -5px rgba(245, 158, 11, 0.25)',
      },
      backgroundImage: {
        'cosmic-gradient': 'radial-gradient(ellipse at top, #111a36 0%, #070b18 50%, #03050c 100%)',
        'nebula-gradient': 'radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(56, 189, 248, 0.12) 0%, transparent 50%)',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
      animation: {
        twinkle: 'twinkle 4s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
