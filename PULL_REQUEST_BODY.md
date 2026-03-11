# 퍼블 타임라인 abbrev·연도 필터 개선

## 요약
- 퍼블 타임라인: 논문 클릭 시 paper 링크 우선, 호버 시 포털 툴팁(PDF preprint+제목)
- 타임라인 라벨을 md `abbrev` 필드로 통일 (HCIK, IMWUT, CHI 등), 하드코딩 제거
- 좁은 화면에서 최신 연도 먼저 노출, 스크롤 힌트(‹‹)
- 범례 위 유지, 모바일만 오른쪽 정렬, 상자+글자 순서, Conference 주황 파스텔
- 연도 필터: Start에서 Today 제거, Start 기본값 = 데이터 기준 가장 오래된 연도, availableYears 빈값 제거
- gatsby-node Frontmatter에 `abbrev` 추가, 논문 md에 abbrev 필드 추가

## 로컬에서 실행 (한 번만)

```bash
cd HAI-lab-KNU.github.io
git push -u origin feat/publication-timeline-abbrev-filter
gh pr create --base main --head feat/publication-timeline-abbrev-filter --title "feat: 퍼블 타임라인 abbrev·연도 필터 개선" --body "$(cat PULL_REQUEST_BODY.md)"
```

또는 push 후 GitHub 웹에서 **Compare & pull request** 클릭해도 됩니다.
