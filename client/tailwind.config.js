/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    fontFamily: {
      sans: ['Lato', 'sans-serif'],
      body: ['Lato', 'sans-serif'],
    },
    extend: {
      transitionProperty: {
        'width': 'width'
      },
      transitionDelay: {
        '6000': '6000ms',
      }
    },
  },
  plugins: [],
}

