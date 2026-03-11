import * as React from "react"
import { graphql, PageProps, Link } from "gatsby"
import { motion, AnimatePresence } from "framer-motion"
import Layout from "../components/layout"
import YearFilter from "../components/YearFilter"
import PublicationTimeline from "../components/PublicationTimeline"
import { FaMedal, FaFilePdf, FaPlay } from "react-icons/fa"
import Seo from "../components/seo"

type DataProps = {
  allMarkdownRemark: {
    nodes: {
      id: string
      excerpt: string
      fields: {
        slug: string
      }
      frontmatter: {
        title: string
        authors: string
        journal: string
        type: string
        year: string
        doi: string
        abstract: string
        paper: string
        slide: string
        video: string
        abbrev?: string
        award?: string
      }
    }[]
  }
}

const PublicationsPage: React.FC<PageProps<DataProps>> = ({ data }) => {
  const publications = data.allMarkdownRemark.nodes
  const [startYear, setStartYear] = React.useState<string>(() => {
    const years = [...new Set(publications.map(p => p.frontmatter.year).filter((y): y is string => y != null && y !== ""))]
    if (years.length === 0) return ""
    years.sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
    return years[0]
  })
  const [endYear, setEndYear] = React.useState<string>("")
  const [selectedTypes, setSelectedTypes] = React.useState<string[]>(["Journal", "Conference", "Poster"])

  // 사용 가능한 연도 목록 생성 (최신순, 유효한 연도만)
  const availableYears = React.useMemo(() => {
    const years = [...new Set(publications.map(pub => pub.frontmatter.year).filter((y): y is string => y != null && y !== ""))].sort((a, b) => parseInt(b, 10) - parseInt(a, 10))
    return years
  }, [publications])

  // 사용 가능한 타입 목록 생성
  const availableTypes = React.useMemo(() => {
    const types = ["Journal", "Conference", "Poster"]
    return types
  }, [publications])

  // 타입 선택/해제 핸들러
  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  // 연도 변경 시 Start > End 되지 않도록 반대쪽 자동 보정
  const handleStartYearChange = (year: string) => {
    setStartYear(year)
    if (year && endYear && parseInt(year, 10) > parseInt(endYear, 10)) {
      setEndYear(year)
    }
  }
  const handleEndYearChange = (year: string) => {
    setEndYear(year)
    if (year && startYear && parseInt(year, 10) < parseInt(startYear, 10)) {
      setStartYear(year)
    }
  }

  // 타임라인용: 연도 필터(Start/End)만 적용한 연도 목록 → 타임라인은 항상 전체 연도 축 유지, 블록만 타입 필터 반영
  const timelineYearOrder = React.useMemo(() => {
    const years = [...new Set(publications.map(p => p.frontmatter.year).filter((y): y is string => y != null && y !== ""))]
    const start = startYear ? parseInt(startYear, 10) : 0
    const end = endYear ? parseInt(endYear, 10) : 9999
    return years
      .filter(y => {
        const n = parseInt(y, 10)
        return !Number.isNaN(n) && n >= start && n <= end
      })
      .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
  }, [publications, startYear, endYear])

  // 필터링된 논문 목록
  const filteredPublications = React.useMemo(() => {
    return publications.filter(pub => {
      const year = parseInt(pub.frontmatter.year)
      const start = startYear ? parseInt(startYear, 10) : 0
      const end = endYear ? parseInt(endYear, 10) : 9999
      const typeMatch = selectedTypes.length > 0 && selectedTypes.includes(pub.frontmatter.type)
      return year >= start && year <= end && typeMatch
    })
  }, [publications, startYear, endYear, selectedTypes])

  // 연도별로 그룹화하고 최신순으로 정렬
  const groupedPublications = React.useMemo(() => {
    return filteredPublications.reduce((groups: { [key: string]: any[] }, pub) => {
      const year = pub.frontmatter.year
      if (!groups[year]) {
        groups[year] = []
      }
      groups[year].push(pub)
      return groups
    }, {})
  }, [filteredPublications])

  // 연도를 내림차순으로 정렬 (최신 연도가 먼저)
  const sortedYears = Object.keys(groupedPublications).sort((a, b) => parseInt(b) - parseInt(a))

  return (
    <Layout activeLink="Publications">
      <div className="max-w-7xl mx-auto px-3 md:px-8 py-6 md:py-8">
        <div className="space-y-8">
        {/* 연도·유형별 시각화. 타입을 하나도 선택 안 하면 타임라인 천천히 페이드아웃 후 비표시 */}
        <AnimatePresence mode="wait">
          {filteredPublications.length > 0 && (
            <motion.div
              key="timeline"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.45, ease: "easeOut" } }}
            >
              <PublicationTimeline
                publications={filteredPublications}
                yearOrder={timelineYearOrder}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 연도 필터: 타임라인 아래 */}
        <YearFilter
          startYear={startYear}
          endYear={endYear}
          selectedTypes={selectedTypes}
          onStartYearChange={handleStartYearChange}
          onEndYearChange={handleEndYearChange}
          onTypeChange={handleTypeToggle}
          availableYears={availableYears}
          availableTypes={availableTypes}
        />

        {filteredPublications.length === 0 ? (
          <p className="text-gray-600">No publications found for the selected filters.</p>
        ) : (
          <div className="space-y-8">
            {sortedYears.map((year) => (
              <div key={year} id={year} className="space-y-1">
                <h2 className="text-base md:text-lg font-normal text-gray-800 border-b border-gray-200 pb-1">{year}</h2>
                <div className="space-y-6">
                  {groupedPublications[year].map((pub) => (
                    <article key={pub.id} className="bg-white rounded-lg p-3 md:p-6 shadow-sm hover:bg-gray-50 transition-colors duration-200">
                      <div className="space-y-2">
                        {pub.frontmatter.doi ? (
                          <a
                            href={pub.frontmatter.doi.startsWith('http') ? pub.frontmatter.doi : `https://doi.org/${pub.frontmatter.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <h2 className="text-base md:text-lg font-normal text-gray-900 hover:text-blue-600 transition-colors duration-200 cursor-pointer">
                              {pub.frontmatter.title}
                            </h2>
                          </a>
                        ) : (
                          <h2 className="text-base md:text-lg font-normal text-gray-900">
                            {pub.frontmatter.title}
                          </h2>
                        )}
                        
                        <div className="text-xs text-gray-600">
                          <div className="mb-1 flex items-center gap-2">
                            <span>{pub.frontmatter.authors}</span>
                            {/* 수상 배지를 저자 이름 옆에 표시 */}
                            {pub.frontmatter.award && (
                              <span className="inline-flex items-center text-xs font-semibold text-yellow-600">
                                <FaMedal className="w-3 h-3 mr-1" />
                                {pub.frontmatter.award}
                              </span>
                            )}
                          </div>
                          <p className="mb-2">
                            <span className="italic">{pub.frontmatter.journal}, {pub.frontmatter.year}</span>
                            {pub.frontmatter.tags && pub.frontmatter.tags.includes('Top Conference') ? (
                              <span className="ml-2 font-bold text-yellow-600">Top Conference</span>
                            ) : pub.frontmatter.journal && (
                              pub.frontmatter.journal.includes('International Journal of Human-Computer Studies') ||
                              pub.frontmatter.journal.includes('Computers & Education') ||
                              pub.frontmatter.journal.includes('Computers in Human Behavior')
                            ) ? (
                              <span className="ml-2 font-bold text-yellow-600">JCR 7%</span>
                            ) : null}
                          </p>
                        </div>
                        
                        <div className="flex space-x-3">
                          {pub.frontmatter.paper && (
                            <a 
                              href={pub.frontmatter.paper}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded hover:bg-blue-100 transition-colors duration-200"
                            >
                              <FaFilePdf className="mr-1 w-3 h-3" />
                              PDF
                            </a>
                          )}
                          {pub.frontmatter.slide && (
                            <a 
                              href={pub.frontmatter.slide}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded hover:bg-blue-100 transition-colors duration-200"
                            >
                              slide
                            </a>
                          )}
                          {pub.frontmatter.video && (
                            <a 
                              href={pub.frontmatter.video}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded hover:bg-blue-100 transition-colors duration-200"
                            >
                              <FaPlay className="mr-1 w-3 h-3" />
                              Video
                            </a>
                          )}

                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        </div>

      </div>
    </Layout>
  )
}

export const query = graphql`
  {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/publications/" } }
      sort: { frontmatter: { date: DESC } }
    ) {
      nodes {
        id
        excerpt
        fields {
          slug
        }
        frontmatter {
          title
          authors
          journal
          type
          year
          doi
          abstract
          paper
          slide
          video
          abbrev
          award
          tags
        }
      }
    }
  }
`

export default PublicationsPage

export const Head = () => <Seo title="HAI LAB" /> 