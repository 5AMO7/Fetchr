/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
      },
      colors: {
        'text-primary': '#262626',
        'text-secondary': '#8E8E8E',
        'text-secondary-dark': '#707070',
      
        'border-light': '#E6E8E9',
        'border-medium': '#DADADA',
        'border-dark': '#CFD3D5',
        
        'border-danger': '#F0D6D6',
        'border-warning': '#F0E1D6',
        'border-attention': '#F0EDD6',
        'border-success': '#D6F0D6',
        'border-info': '#D6E3F6',

        'danger': '#FFEBEB',
        'warning': '#FFF4EB',
        'attention': '#FFFFEB',
        'success': '#EFFFEB',
        'info': '#EBF6FF',

        'text-danger': '#711515',        
        'text-warning': '#715815',
        'text-attention': '#716915',
        'text-success': '#157145',
        'text-info': '#6994B8',
        
        'accent': '#157145',
        'bad': '#CE4040',
        'background-primary': '#FFFFFF',
        'background-secondary': '#F5F7F9',

        'dark-primary': '#f6f6f6',
        'dark-secondary': '#f0f0f1',
      }
    },
  },
  plugins: [],
}

