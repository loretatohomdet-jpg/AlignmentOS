/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"SF Pro Display"',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        display: ['"Playfair Display"', 'Georgia', 'ui-serif', 'serif'],
      },
      fontSize: {
        'display': ['3.75rem', { lineHeight: '1.05', letterSpacing: '-0.025em' }],
        'headline': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.022em' }],
        'title': ['1.5rem', { lineHeight: '1.35', letterSpacing: '-0.015em' }],
      },
      colors: {
        /**
         * Brand palette — no pure black. `accent` = warm ink for type & hairlines; `deep` = dark olive-brown surfaces.
         */
        alignment: {
          primary: '#6E7158',
          secondary: '#9A9B84',
          foundation: '#F7F5F0',
          surface: '#E7E4DC',
          neutral: '#D6D2C8',
          /** Primary text & UI ink — dark warm green-gray (not #000) */
          accent: '#2c2e26',
          /** Immersive dark sections (diagnostic shell, overlays) */
          deep: '#252822',
          /** Alias — same as accent */
          ink: '#2c2e26',
        },
        /* Legacy `apple.*` — maps to alignment tokens for existing classes */
        apple: {
          gray: '#2c2e26',
          'gray-light': '#F7F5F0',
          'gray-dark': '#2c2e26',
          blue: '#6E7158',
          'blue-hover': '#5a5d47',
          surface: '#F7F5F0',
          'surface-muted': '#F7F5F0',
        },
      },
      boxShadow: {
        /** Warm ink (#2c2e26) — not pure black */
        'apple': '0 1px 3px rgba(44,46,38,0.06), 0 6px 16px rgba(44,46,38,0.06)',
        'apple-lg': '0 4px 12px rgba(44,46,38,0.07), 0 12px 40px rgba(44,46,38,0.08)',
      },
      borderRadius: {
        '2.5xl': '1.25rem',
        '3xl': '1.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'gradient-shift': 'gradientShift 12s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-soft': 'glowSoft 4s ease-in-out infinite',
        'marquee-domains': 'marqueeDomains 36s linear infinite',
        'agent-pop': 'agentPop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      },
      keyframes: {
        agentPop: {
          '0%': { opacity: '0', transform: 'translateY(-14px) scale(0.92)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        gradientShift: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.7' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        glowSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        marqueeDomains: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
