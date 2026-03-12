import * as React from "react"
import { createPortal } from "react-dom"
import { Link } from "gatsby"
import { motion, AnimatePresence } from "framer-motion"

export type PublicationNode = {
  id: string
  fields?: { slug: string }
  frontmatter: {
    title: string
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

    if (canScroll && !hasScrolledToEndRef.current) {
      hasScrolledToEndRef.current = true
      el.scrollLeft = el.scrollWidth
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
      : Object.keys(byYear).sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
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
          {/* 범례: 위에 유지, 모바일에서만 오른쪽 정렬(최신 먼저 보일 때 보이도록), 글자+상자 */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-2 text-xs text-muted justify-end md:justify-start">
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
                      transition: { staggerChildren: 0.09, delayChildren: 0.03 },
                    },
                  }}
                  initial="hidden"
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
                            hidden: { opacity: 0, y: -80 },
                            visible: {
                              opacity: 1,
                              y: [-80, 10, -5, 0],
                              transition: { duration: 0.6, ease: "easeOut" },
                            },
                            exit: {
                              opacity: 0,
                              y: 48,
                              transition: { duration: 0.5, ease: "easeOut" },
                            },
                          }}
                          initial="hidden"
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
        {/* 스크롤 가능 시 왼쪽에 표시 (과거 쪽으로 스크롤하라는 투명 화살표) */}
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
      {/* 호버 카드 포털: 잘림 방지, 투명 배경, 퍼블 목록과 어울리는 스타일 */}
      {(typeof document !== "undefined" && hoveredPub && triggerRect
        ? createPortal(
          (() => {
            const maxW = 520
            const minW = 280
            const w = Math.min(maxW, Math.max(minW, window.innerWidth - 32))
            const half = w / 2
            const left = Math.max(
              16,
              Math.min(triggerRect.left + triggerRect.width / 2 - half, window.innerWidth - w - 16)
            )
            const top = triggerRect.top - 8
            return (
              <div
                className="fixed z-[9999] px-3 py-2 rounded-lg shadow-lg border border-default whitespace-normal text-left pointer-events-none transition-opacity duration-150 bg-surface/95 backdrop-blur-sm"
                style={{
                  left,
                  top,
                  width: w,
                  minWidth: minW,
                  maxWidth: maxW,
                  transform: "translateY(-100%)",
                }}
              >
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-xs font-medium text-accent shrink-0">PDF preprint</span>
                  <span className="text-base font-normal text-primary break-words leading-snug">
                    {`"${hoveredPub.frontmatter.title}"`}
                  </span>
                </div>
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
