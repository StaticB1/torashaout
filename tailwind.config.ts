import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: {
            DEFAULT: '#9333ea',
            light: '#a855f7',
            dark: '#7e22ce',
          },
          pink: {
            DEFAULT: '#db2777',
            light: '#ec4899',
            dark: '#be185d',
          },
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(to right, #9333ea, #ec4899)',
      },
    },
  },
  plugins: [],
}
export default config
