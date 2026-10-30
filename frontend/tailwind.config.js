/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        heritage: {
          bg: '#FBF7F0',          // Warm aged ivory / vellum background
          card: '#F5EFEB',        // Museum plaque card
          cardHover: '#EDE4DC',   // Slightly deeper tone on hover
          border: '#E3D7C7',      // Aged parchment border
          darkBorder: '#C8BAA7',  // Deeper stone divider
          charcoal: '#2A2421',    // Archival charcoal heading
          ink: '#3D3531',         // Primary body text
          secondary: '#6E615A',   // Subtitles, descriptive notes
          muted: '#968880',       // Labels, small metadata
          sandstone: '#B86548',   // Jaipur red sandstone structure
          sandstoneDark: '#8F3F28', // Shaded sandstone
          marble: '#FAF8F5',      // Quadrant scale marble
          marbleLine: '#4A4039',  // Marble graduation marks
          gold: '#C5A059',        // Antique brass / royal gold rule
          goldLight: '#DFC17E',   // Glowing celestial accents
          goldDark: '#917135',    // Burnished gold borders
          terracotta: '#C45138',  // Vibrant terracotta accent
          terracottaDark: '#9E3B27'
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        display: ['Cinzel', 'serif'],
        devanagari: ['"Noto Serif Devanagari"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      boxShadow: {
        'heritage-card': '0 4px 20px -2px rgba(42, 36, 33, 0.08), 0 2px 6px -1px rgba(42, 36, 33, 0.04)',
        'heritage-hover': '0 10px 25px -4px rgba(42, 36, 33, 0.12), 0 4px 10px -2px rgba(42, 36, 33, 0.06)',
        'plaque': 'inset 0 0 0 1px #E3D7C7, 0 8px 24px -4px rgba(42, 36, 33, 0.1)'
      }
    },
  },
  plugins: [],
};

