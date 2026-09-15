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
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          500: '#0284c7',
          600: '#0265d2',
          700: '#034aa6',
          900: '#0f172a',
        },
        sev: {
          1: '#ef4444', // Critical red
          2: '#f97316', // High orange
          3: '#eab308', // Medium yellow
          4: '#3b82f6', // Low blue
        }
      },
    },
  },
  plugins: [],
};
