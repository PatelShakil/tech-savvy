/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        loading: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-10px)' },
          '60%': { transform: 'translateY(-5px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'loading-dot-1': 'loading 1.5s infinite 0.1s',
        'loading-dot-2': 'loading 1.5s infinite 0.2s',
        'loading-dot-3': 'loading 1.5s infinite 0.3s',
        'spin-slow': 'spin 8s linear infinite',
        'fade-in': 'fadeIn 2s ease-out'
      },
    },
  },
  plugins: [],
}
