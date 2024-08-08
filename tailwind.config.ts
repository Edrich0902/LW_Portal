import flowbitePlugin from 'flowbite/plugin'

import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'],
  darkMode: 'selector',
	theme: {
		extend: {
      colors: {
        // flowbite-svelte
        primary: {
          50: '#e3f6fb',
          100: '#b9e9f4',
          200: '#8ddaee',
          300: '#68cbe8',
          400: '#51bfe5',
          500: '#41b4e2',
          600: '#39a6d4',
          700: '#3093c1',
          800: '#2d81ae',
          900: '#22628c'
        }
      }
    }
	},

	plugins: [flowbitePlugin]
} as Config;