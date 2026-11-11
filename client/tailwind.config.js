/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lavish: {
          dark: '#0B0B0C',
          charcoal: '#141417',
          card: '#1A181C',
          cardHover: '#231F24',
          border: '#332A20',
          borderGold: '#785A28',
          gold: '#D4AF37',
          goldLight: '#F5D77F',
          goldMuted: '#AA8839',
          goldDark: '#8A6820',
          brown: '#231913',
          brownDeep: '#18110D',
          cream: '#FAF6EE',
          creamSoft: '#EFE6D5',
          creamMuted: '#B8AFA0'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Cormorant', 'Georgia', 'serif'],
        cinzel: ['"Cinzel"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(212, 175, 55, 0.3)',
        'gold-sm': '0 0 12px -2px rgba(212, 175, 55, 0.25)',
        'gold-lg': '0 0 35px -5px rgba(212, 175, 55, 0.45)',
        'luxury': '0 15px 35px -10px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(212, 175, 55, 0.2)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F5D77F 0%, #D4AF37 50%, #AA8839 100%)',
        'gold-metallic': 'linear-gradient(90deg, #C5A059 0%, #F5E5AB 50%, #C5A059 100%)',
        'dark-radial': 'radial-gradient(circle at 50% 20%, #251B14 0%, #0B0B0C 75%)',
        'card-gradient': 'linear-gradient(180deg, rgba(28, 24, 28, 0.95) 0%, rgba(18, 16, 20, 0.98) 100%)',
      }
    },
  },
  plugins: [],
}
