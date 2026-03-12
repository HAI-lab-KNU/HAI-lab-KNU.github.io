# 팔레트 대응표 (라이트 / 다크)

다크모드 전환 시 `.dark` 클래스로 CSS 변수가 바뀌며, Tailwind 유틸(`bg-page`, `text-primary` 등)이 자동으로 다크 색을 참조합니다.

| 키 | 라이트 | 다크 | 용도 한줄 |
|----|--------|------|-----------|
| page | `#ffffff` | `#111827` (gray-900) | 페이지 배경 |
| page-muted | `#eff6ff` (blue-50) | `#111827` (gray-900) | 페이지 보조 배경 |
| surface | `#ffffff` | `#1f2937` (gray-800) | 카드/패널 배경 |
| surface-muted | `#f9fafb` (gray-50) | `#374151` (gray-700) | 보조 서페이스 |
| surface-subtle | `#f3f4f6` (gray-100) | `#374151` (gray-700) | 연한 서페이스 |
| primary | `#111827` (gray-900) | `#f3f4f6` (gray-100) | 제목/본문 강조 텍스트 |
| secondary | `#1f2937` (gray-800) | `#e5e7eb` (gray-200) | 부제목 텍스트 |
| muted | `#4b5563` (gray-600) | `#9ca3af` (gray-400) | 보조 텍스트 |
| muted-subtle | `#6b7280` (gray-500) | `#6b7280` (gray-500) | placeholder 등 |
| default | `#e5e7eb` (gray-200) | `#4b5563` (gray-600) | 카드/리스트 테두리 |
| border-muted | `#f3f4f6` (gray-100) | `#374151` (gray-700) | 연한 테두리 |
| accent | `#2563eb` (blue-600) | `#60a5fa` (blue-400) | 링크/강조 버튼 |
| accent-hover | `#1d4ed8` (blue-700) | `#93c5fd` (blue-300) | accent 호버 |
| accent-muted | `#eff6ff` (blue-50) | `rgba(30,58,138,0.4)` (blue-900/40) | accent 배경/뱃지 |

## CSS 변수명

- `--color-page`, `--color-page-muted`, `--color-surface`, `--color-surface-muted`, `--color-surface-subtle`
- `--color-primary`, `--color-secondary`, `--color-muted`, `--color-muted-subtle`, `--color-default`
- `--color-border-muted`, `--color-accent`, `--color-accent-hover`, `--color-accent-muted`

`tailwind.config.js`의 `theme.extend.colors`가 위 변수를 참조하므로, `html` 또는 상위에 `.dark`를 붙이면 다크 색이 적용됩니다.
