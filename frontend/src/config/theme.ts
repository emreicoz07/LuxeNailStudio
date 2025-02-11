export const theme = {
  colors: {
    primary: {
      50: '#FFF5F7',
      100: '#FFE3EA',
      200: '#FFB8C9',
      300: '#FF8BA7',  // Main candy pink
      400: '#FF6088',
      500: '#FF3366',  // Deep pink
      600: '#FF1A4F',
      gradient: 'linear-gradient(135deg, #FF8BA7 0%, #FF3366 100%)',
    },
    secondary: {
      50: '#F7F8FC',
      100: '#EDF0F7',
      200: '#E2E8F0',
      300: '#CBD5E0',
      400: '#A0AEC0',
      500: '#718096',
      600: '#4A5568',
    },
    accent: {
      gold: '#D4AF37',
      rose: '#FEC5E5',
      pearl: '#F8F0E3',
      cream: '#FFFAF0',
    },
    background: {
      primary: '#FFFFFF',
      secondary: '#F7F8FC',
      gradient: {
        pink: 'linear-gradient(135deg, #FFF5F7 0%, #FFE3EA 100%)',
        gold: 'linear-gradient(135deg, #D4AF37 0%, #F8F0E3 100%)',
      }
    },
    text: {
      primary: '#2D3748',
      secondary: '#718096',
      light: '#A0AEC0',
    }
  },
  typography: {
    fonts: {
      primary: '"Poppins", sans-serif',
      secondary: '"Playfair Display", serif',
      accent: '"Great Vibes", cursive',
    },
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
  },
  spacing: {
    container: {
      padding: '2rem',
      maxWidth: '1280px',
    }
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '1rem',
    full: '9999px',
  },
  transitions: {
    base: 'all 0.3s ease-in-out',
    slow: 'all 0.5s ease-in-out',
    fast: 'all 0.15s ease-in-out',
  }
}; 