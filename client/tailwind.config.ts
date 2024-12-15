import { fontFamily } from "tailwindcss/defaultTheme";
import type { Config } from "tailwindcss";

const config: Config = {
	content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'],
  darkMode: 'selector',
	theme: {
		extend: {
      colors: {
        nectar: '#fcd34d',
        relics: '#a855f7',
        stardust: '#3b82f6',
        prisms: '#84cc16',
        common: '#e2e8f0',
        uncommon: '#3eed3e',
        rare: '#3b82f6',
        epic: '#faec55',
        radiant: '#f6ad55',
        ascendant: '#f56565',
        perfected: '#55dffa',


        // flowbite-svelte
        primary: {
          50: '#FFF5F2',
          100: '#FFF1EE',
          200: '#FFE4DE',
          300: '#FFD5CC',
          400: '#FFBCAD',
          500: '#FE795D',
          600: '#EF562F',
          700: '#EB4F27',
          800: '#CC4522',
          900: '#A5371B'
        }
      }
    }
	}
};

export default config;
