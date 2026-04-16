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
        // ─── 공통 디자인 토큰 (이슈 #34 버튼, 이슈 #35 타이포그래피) ───
        // 버튼 패딩 / 폰트 기준 (btn-* 유틸로 @layer components에서 사용)
        // 타이포그래피 스케일 기준
        //   page-title  : text-3xl md:text-5xl font-light   (페이지 H1)
        //   section-title: text-2xl md:text-4xl font-light  (섹션 H2)
        //   card-title  : text-base md:text-lg font-semibold (카드 H2/H3)
        //   body-lg     : text-sm md:text-base font-light    (본문 p)
        //   label       : text-xs font-medium                (레이블·뱃지)
      },
    },
    plugins: [],
  }