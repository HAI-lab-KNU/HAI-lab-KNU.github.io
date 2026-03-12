/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          page: 'var(--color-page)',
          'page-muted': 'var(--color-page-muted)',
          surface: 'var(--color-surface)',
          'surface-muted': 'var(--color-surface-muted)',
          'surface-subtle': 'var(--color-surface-subtle)',
          primary: 'var(--color-primary)',
          secondary: 'var(--color-secondary)',
          muted: 'var(--color-muted)',
          'muted-subtle': 'var(--color-muted-subtle)',
          default: 'var(--color-default)',
          'border-muted': 'var(--color-border-muted)',
          accent: 'var(--color-accent)',
          'accent-hover': 'var(--color-accent-hover)',
          'accent-muted': 'var(--color-accent-muted)',
        },
        fontFamily: {
          sans: ['Inter', 'Noto Sans KR', 'system-ui', 'sans-serif'],
          display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
          body: ['Source Sans Pro', 'Inter', 'system-ui', 'sans-serif'],
        },
      },
    },
    plugins: [],
  }