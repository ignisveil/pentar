import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        gold: '#e6b873',
        fire: '#ff7a2f',
        ember: '#ff3b19'
      },
      boxShadow: {
        glow: '0 0 40px rgba(255,122,47,0.25)'
      }
    }
  },
  plugins: []
}
export default config
