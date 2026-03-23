import * as React from "react"
import { createPortal } from "react-dom"
import { Link } from "gatsby"
import { motion, AnimatePresence } from "framer-motion"

export type PublicationNode = {
  id: string
  fields?: { slug: string }
  frontmatter: {
    title: string
    authors?: string
    journal: string
    type: string
    year: string
    doi?: string
    paper?: string
    abbrev?: string
  }
}

type PublicationTimelineProps = {
  publications: PublicationNode[]
  /** 연도 축을 고정할 때 사용. 없으면 publications에서 연도 추출 */
  yearOrder?: string[]
}

const TYPE_COLORS: Record<string, { bg: string; label: string }> = {
  Journal: { bg: "bg-blue-200", label: "Journal" },
  Conference: { bg: "bg-orange-200", label: "Conference" },
  Poster: { bg: "bg-slate-200", label: "Poster" },
}

function getShortLabel(journal: string): string {
  if (!journal) return "—"
  const j = journal.trim()
  if (j.length <= 18) return j
  return j.split(/[\s,&]+/)[0]?.slice(0, 10) || "—"
}

function getDisplayLabel(pub: PublicationNode): string {
  if (pub.frontmatter.abbrev?.trim()) return pub.frontmatter.abbrev.trim()
  return getShortLabel(pub.frontmatter.journal)
}

const PublicationTimeline: React.FC<PublicationTimelineProps> = ({ publications, yearOrder: yearOrderProp }) => {
  const [hoveredPub, setHoveredPub] = React.useState<PublicationNode | null>(null)
  const [hoveredEl, setHoveredEl] = React.useState<HTMLElement | null>(null)
  const [triggerRect, setTriggerRect] = React.useState<DOMRect | null>(null)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [showScrollHint, setShowScrollHint] = React.useState(false)
  const hasScrolledToEndRef = React.useRef(false)
  const prevPublicationsRef = React.useRef(publications)
  const preserveScrollRef = React.useRef<number | null>(null)
  const lastScrollRatioRef = React.useRef<number>(0)
  /**
   * 첫 방문(세션에 플래그 없음): 입장 애니 끔 — 사용자 요청.
   * 타입 전부 해제 후 다시 켜면 컴포넌트가 리마운트되는데, 이때 ref만 쓰면 다시 "첫 페인트"로 착각해 애니가 꺼짐.
   * sessionStorage로 "이미 타임라인 본 적 있음"을 남기면 재마운트 시 입장 애니가 다시 살아남.
   */
  const SESSION_KEY = "hai-pub-timeline-entrance-seen"
  const skipEntranceAnimation = React.useMemo(() => {
    if (typeof window === "undefined") return true
    return !sessionStorage.getItem(SESSION_KEY)
  }, [])
  React.useEffect(() => {
    sessionStorage.setItem(SESSION_KEY, "1")
  }, [])

  // 필터(publications) 변경 시 스크롤 비율 보존: 렌더 시점에 복원용으로 저장 (effect보다 ResizeObserver가 먼저 돌 수 있음)
  if (prevPublicationsRef.current !== publications) {
    preserveScrollRef.current = lastScrollRatioRef.current
    prevPublicationsRef.current = publications
  }

  React.useEffect(() => {
    if (!hoveredEl) {
      setTriggerRect(null)
      return
    }
    const update = () => setTriggerRect(hoveredEl.getBoundingClientRect())
    update()
    window.addEventListener("scroll", update, true)
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update, true)
      window.removeEventListener("resize", update)
    }
  }, [hoveredEl])

  const updateScrollHint = React.useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const canScroll = el.scrollWidth > el.clientWidth
    const maxScroll = el.scrollWidth - el.clientWidth
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8
    setShowScrollHint(canScroll && atEnd)

    // 평소에 스크롤 비율 기록 (필터 변경 시 복원용)
    if (maxScroll > 0) {
      lastScrollRatioRef.current = el.scrollLeft / maxScroll
    }

    // 필터 변경으로 콘텐츠가 줄어든 뒤 스크롤이 막 오른쪽으로 밀리는 것 방지: 저장해 둔 비율 복원
    if (preserveScrollRef.current !== null) {
      if (maxScroll > 0) {
        el.scrollLeft = Math.round(preserveScrollRef.current * maxScroll)
      }
      preserveScrollRef.current = null
      return
    }

    /* 연도 축: 왼쪽=최신 → 첫 로드 시 스크롤은 왼쪽(0) */
    if (canScroll && !hasScrolledToEndRef.current) {
      hasScrolledToEndRef.current = true
      el.scrollLeft = 0
    }
  }, [])

  React.useEffect(() => {
    updateScrollHint()
    const el = scrollRef.current
    if (!el) return
    const raf = requestAnimationFrame(() => updateScrollHint())
    const ro = new ResizeObserver(updateScrollHint)
    ro.observe(el)
    el.addEventListener("scroll", updateScrollHint, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      el.removeEventListener("scroll", updateScrollHint)
    }
  }, [updateScrollHint])

  const { yearOrder, byYear } = React.useMemo(() => {
    const byYear: Record<string, PublicationNode[]> = {}
    publications.forEach((pub) => {
      const y = pub.frontmatter.year
      if (!y) return
      if (!byYear[y]) byYear[y] = []
      byYear[y].push(pub)
    })
    const order = yearOrderProp?.length
      ? yearOrderProp
      : Object.keys(byYear).sort((a, b) => parseInt(b, 10) - parseInt(a, 10))
    return { yearOrder: order, byYear }
  }, [publications, yearOrderProp])

  if (yearOrder.length === 0) return null

  return (
    <div className="mb-6 md:mb-8">
      <div className="relative">
        <div
          ref={scrollRef}
          className="p-3 sm:p-4 md:p-6 overflow-x-auto -mx-1 sm:mx-0 scroll-smooth"
          style={{ scrollbarGutter: "stable" }}
        >
          {/* 범례: 위에 유지, 왼쪽=최신 축과 맞춰 모바일도 왼쪽 정렬 */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-2 text-xs text-muted justify-start">
            {Object.entries(TYPE_COLORS).map(([type, { bg, label }]) => (
              <span key={type} className="inline-flex items-center gap-1">
                <span className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-sm ${bg} flex-shrink-0`} aria-hidden />
                <span>{label}</span>
              </span>
            ))}
          </div>
          {/* Timeline: 연도별 컬럼 */}
          <div
            className="grid gap-x-4 sm:gap-x-6 md:gap-x-8 min-w-max"
            style={{
              gridTemplateColumns: `repeat(${yearOrder.length}, minmax(72px, 1fr))`,
              gridTemplateRows: "auto 1px auto",
            }}
          >
          <AnimatePresence mode="popLayout">
          {yearOrder.map((year) => {
            const items = byYear[year] ?? []
            const staggerOn = !skipEntranceAnimation
            return (
              <motion.div
                key={year}
                layout
                exit={{
                  opacity: 0,
                  y: 48,
                  transition: { duration: 0.5, ease: "easeOut" },
                }}
                transition={{
                  layout: { type: "spring", mass: 0.7, damping: 14, stiffness: 160 },
                }}
                style={{ minWidth: 0 }}
              >
                {/* 블록 영역: layout + spring, staggerChildren, hover 살짝 확대, filter 시 촤르륵 drop.
                    고정 높이를 둬서 블록들이 항상 연도 숫자 위(바닥)에서부터 위로 쌓이도록 함 */}
                <motion.div
                  className="flex flex-col justify-end gap-1.5 h-24 sm:h-28 md:h-32"
                  layout
                  variants={{
                    hidden: {},
                    visible: {
                      transition: {
                        staggerChildren: staggerOn ? 0.14 : 0,
                        delayChildren: staggerOn ? 0.08 : 0,
                      },
                    },
                  }}
                  initial={skipEntranceAnimation ? false : "hidden"}
                  animate="visible"
                  transition={{
                    layout: { type: "spring", mass: 0.7, damping: 14, stiffness: 160 },
                  }}
                >
                  <AnimatePresence mode="popLayout">
                    {[...items].reverse().map((pub) => {
                      const typeStyle = TYPE_COLORS[pub.frontmatter.type] ?? TYPE_COLORS.Conference
                      const short = getDisplayLabel(pub)
                      const content = (
                        <>
                          <div className="min-w-0" aria-hidden />
                          <div className="min-h-[1rem] flex items-center justify-center">
                            <span
                              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-sm flex-shrink-0 ${typeStyle.bg}`}
                              aria-hidden
                            />
                          </div>
                          <div className="min-h-[1rem] flex items-center min-w-0 pl-1">
                            <span
                              className="text-xs text-secondary truncate max-w-[56px] sm:max-w-[80px] md:max-w-[120px] leading-4 group-hover:text-accent"
                              aria-label={`${pub.frontmatter.title} (${pub.frontmatter.journal})`}
                            >
                              {short}
                            </span>
                          </div>
                        </>
                      )
                      const cellClass =
                        "grid grid-cols-[1fr_1.5rem_1fr] sm:grid-cols-[1fr_2rem_1fr] grid-rows-1 min-h-0 items-end gap-0 group relative " +
                        (pub.frontmatter.paper || pub.frontmatter.doi || pub.fields?.slug ? "cursor-pointer" : "")

                      const mouseProps = {
                        onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
                          setHoveredEl(e.currentTarget)
                          setHoveredPub(pub)
                        },
                        onMouseLeave: () => {
                          setHoveredEl(null)
                          setHoveredPub(null)
                        },
                      }

                      const blockContent = (
                        <>
                          {pub.frontmatter.paper ? (
                            <a
                              href={pub.frontmatter.paper}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={cellClass}
                              {...mouseProps}
                            >
                              {content}
                            </a>
                          ) : pub.frontmatter.doi ? (
                            <a
                              href={pub.frontmatter.doi.startsWith("http") ? pub.frontmatter.doi : `https://doi.org/${pub.frontmatter.doi}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={cellClass}
                              {...mouseProps}
                            >
                              {content}
                            </a>
                          ) : pub.fields?.slug ? (
                            <Link to={pub.fields.slug} className={cellClass} {...mouseProps}>
                              {content}
                            </Link>
                          ) : (
                            <div className={cellClass} {...mouseProps}>
                              {content}
                            </div>
                          )}
                        </>
                      )

                      return (
                        <motion.div
                          key={pub.id}
                          layout
                          variants={{
                            hidden: { opacity: 0, y: -10 },
                            visible: {
                              opacity: 1,
                              y: 0,
                              transition: {
                                duration: 0.42,
                                ease: [0.25, 0.1, 0.25, 1],
                              },
                            },
                            exit: {
                              opacity: 0,
                              y: 48,
                              transition: { duration: 0.55, ease: "easeOut" },
                            },
                          }}
                          initial={skipEntranceAnimation ? false : "hidden"}
                          animate="visible"
                          exit="exit"
                          whileHover={{ scale: 1.06 }}
                          transition={{
                            layout: { type: "spring", mass: 0.7, damping: 14, stiffness: 160 },
                          }}
                        >
                          {blockContent}
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )
          })}
          </AnimatePresence>
          {/* 가로선: 모든 연도 축 바로 위 한 줄 */}
          <div
            className="col-span-full h-px"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgb(203 213 225) 2%, rgb(203 213 225) 98%, transparent 100%)",
            }}
            aria-hidden
          />
          {yearOrder.map((year) => {
            const items = byYear[year] ?? []
            return (
              <div key={year} className="flex flex-col items-center pt-1">
                <span className="w-px h-3 bg-surface-subtle flex-shrink-0" aria-hidden />
                <span className="text-xs font-medium text-muted mt-1">{year}</span>
                <span className="text-[10px] text-muted-subtle">({items.length})</span>
              </div>
            )
          })}
        </div>
        </div>
        {/* 오른쪽 끝(과거 연도)까지 스크롤했을 때 왼쪽에 ‹ 힌트 (최신 쪽으로) */}
        {showScrollHint && (
          <div
            className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none flex items-center text-muted-subtle/60"
            aria-hidden
          >
            <span className="text-lg font-light tracking-tight" style={{ textShadow: "0 0 8px white" }}>
              ‹ ‹
            </span>
          </div>
        )}
      </div>
      {/* 호버 카드: academic / minimal — 선명한 텍스트, 은은한 테두리·그림자, 짧은 등장 모션 */}
      {(typeof document !== "undefined" && hoveredPub && triggerRect
        ? createPortal(
          (() => {
            /** 긴 학회명(Proceedings of …)도 한 줄에 가깝게 — 좁으면 두 줄 + 점 정렬이 어색해짐 */
            const maxW = 560
            const minW = 280
            const w = Math.min(maxW, Math.max(minW, window.innerWidth - 32))
            const half = w / 2
            const left = Math.max(
              16,
              Math.min(triggerRect.left + triggerRect.width / 2 - half, window.innerWidth - w - 16)
            )
            const top = triggerRect.top - 10
            const venue = [hoveredPub.frontmatter.journal?.trim(), hoveredPub.frontmatter.year?.trim()]
              .filter(Boolean)
              .join(" · ")
            const typeStyle = TYPE_COLORS[hoveredPub.frontmatter.type] ?? TYPE_COLORS.Conference

            return (
              <div
                className="fixed z-[9999] pointer-events-none"
                style={{
                  left,
                  top,
                  width: w,
                  minWidth: minW,
                  maxWidth: maxW,
                  transform: "translateY(-100%)",
                }}
              >
                <motion.div
                  key={hoveredPub.id}
                  role="tooltip"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                  className={[
                    "whitespace-normal text-left rounded-xl",
                    "bg-white dark:bg-slate-950",
                    "border border-slate-200/90 dark:border-slate-700/85",
                    "shadow-[0_10px_40px_-12px_rgba(15,23,42,0.14)] dark:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.55)]",
                    "px-4 py-3.5 sm:px-5 sm:py-4",
                    "max-w-full",
                  ].join(" ")}
                >
                  <div className="flex flex-col gap-3">
                    {/* 1. 타입 색 점(타임라인 범례와 동일) + 저널·학회명 · 연도 */}
                    {venue ? (
                      <div className="pb-3 border-b border-slate-200/80 dark:border-slate-700/80">
                        <div className="flex items-start gap-2.5 min-w-0">
                          <span
                            className={`inline-block h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-sm shrink-0 mt-[0.2em] ${typeStyle.bg}`}
                            aria-hidden
                          />
                          <p className="text-[11px] sm:text-xs font-normal leading-snug text-slate-500 dark:text-slate-400 flex-1 min-w-0">
                            {venue}
                          </p>
                        </div>
                      </div>
                    ) : null}
                    {/* 2. 논문 제목 */}
                    <p className="text-[15px] sm:text-base font-medium leading-[1.58] tracking-[-0.01em] text-slate-900 dark:text-slate-100 [text-rendering:optimizeLegibility]">
                      {hoveredPub.frontmatter.title}
                    </p>
                    {/* 3. 저자 */}
                    {hoveredPub.frontmatter.authors?.trim() ? (
                      <p className="text-[11px] sm:text-xs font-normal leading-relaxed text-slate-600 dark:text-slate-300">
                        {hoveredPub.frontmatter.authors.trim()}
                      </p>
                    ) : null}
                  </div>
                </motion.div>
              </div>
            )
          })(),
          document.body
        )
        : null) as React.ReactNode}
    </div>
  )
}

export default PublicationTimeline
