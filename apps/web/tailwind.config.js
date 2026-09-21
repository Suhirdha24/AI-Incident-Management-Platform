/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      },
      colors: {
        terracotta: {
          50: '#FDF7F4',
          100: '#F9ECE5',
          200: '#F2D5C7',
          300: '#E5B79F',
          400: '#D29272',
          500: '#A8613D', // Primary brand accent (burnt copper / terracotta)
          600: '#935332',
          700: '#784227',
          800: '#60341F',
          900: '#4A2818',
        },
        warm: {
          50: '#FBFAF7',
          100: '#F7F5F1',
          200: '#EEEAE3',
          300: '#E1DBD0',
          400: '#C7BFA3',
          500: '#A39983',
          600: '#7C7360',
          700: '#5B5446',
          800: '#3D382F',
          900: '#1F1D19',
        },
        dark: {
          bg: '#121212',
          surface: '#181818',
          card: '#1e1e1e',
          border: '#2a2a2a',
        },
        sev: {
          1: '#dc2626', // Critical red
          2: '#ea580c', // High orange
          3: '#d97706', // Medium amber
          4: '#2563eb', // Low blue
        }
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '6px',
        md: '8px',
        lg: '10px',
        xl: '12px'
      }
    },
  },
  plugins: [],
};
