import * as React from "react"
import { graphql, PageProps } from "gatsby"
import Layout from "../components/layout"
import YearFilter from "../components/YearFilter"
import Seo from "../components/seo"

type DataProps = {
  allMarkdownRemark: {
    nodes: {
      id: string
      excerpt: string
      frontmatter: {
        title: string
        date: string
        description: string
        type: string
        period: string
        major: boolean
      }
    }[]
  }
}

const LecturesPage: React.FC<PageProps<DataProps>> = ({ data }) => {
  const lectures = data.allMarkdownRemark.nodes
  const [selectedTypes, setSelectedTypes] = React.useState<string[]>([])
  const [startYear, setStartYear] = React.useState("")
  const [endYear, setEndYear] = React.useState("")

  // 사용 가능한 타입들
  const availableTypes = ["Major", "Liberal Arts"]

  // 사용 가능한 연도들 (2020 ~ 현재)
  const currentYear = new Date().getFullYear()
  const availableYears = Array.from({ length: currentYear - 2019 }, (_, i) => (currentYear - i).toString())

  // 타입별로 강의 분류
  const getTypeFromMajor = (major: boolean) => {
    return major ? "Major" : "Liberal Arts"
  }

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

  // 필터링된 강의들
  const filteredLectures = lectures.filter((lecture) => {
    const lectureType = getTypeFromMajor(lecture.frontmatter.major)
    const yearNum = new Date(lecture.frontmatter.date).getFullYear()
    if (Number.isNaN(yearNum)) return false

    const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(lectureType)
    const startNum = startYear ? parseInt(startYear, 10) : 0
    const endNum = endYear ? parseInt(endYear, 10) : 9999
    const yearMatch = yearNum >= startNum && yearNum <= endNum

    return typeMatch && yearMatch
  })

  // 전공 강의를 먼저, 그 다음에 일반 강의를 정렬
  const sortedLectures = [...filteredLectures].sort((a, b) => {
    if (a.frontmatter.major && !b.frontmatter.major) return -1
    if (!a.frontmatter.major && b.frontmatter.major) return 1
    return 0
  })

  return (
    <Layout activeLink="Lectures">
      <div className="max-w-7xl mx-auto px-3 md:px-8 py-6 md:py-8">
        <div className="space-y-8">
        {/* 필터 컴포넌트 */}
        <YearFilter
          startYear={startYear}
          endYear={endYear}
          onStartYearChange={handleStartYearChange}
          onEndYearChange={handleEndYearChange}
          selectedTypes={selectedTypes}
          onTypeChange={handleTypeToggle}
          availableTypes={availableTypes}
          availableYears={availableYears}
          typeLabel="Lecture Type"
        />



        {sortedLectures.length === 0 ? (
          <p className="text-muted text-center">No lectures match the selected filters.</p>
        ) : (
          <div className="space-y-24">
            {sortedLectures.map((lecture) => (
              <div key={lecture.id} className="border-b border-border-muted pb-16">
                <h2 className="list-title leading-tight mb-2">
                  {lecture.frontmatter.title}
                </h2>
                <p className="body-text mb-2">
                  {lecture.frontmatter.description || lecture.excerpt}
                </p>
                <div className="flex items-start space-x-4">
                  {lecture.frontmatter.major === true && (
                    <span className="btn-link-tag bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-800/60 hover:text-orange-800">
                      Major
                    </span>
                  )}
                  <span className="btn-link-tag bg-surface-subtle text-muted hover:bg-surface hover:text-primary">
                    {lecture.frontmatter.period}
                  </span>
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
      filter: { fileAbsolutePath: { regex: "/content/lectures/" } }
      sort: { frontmatter: { date: DESC } }
    ) {
      nodes {
        id
        excerpt
        frontmatter {
          title
          date(formatString: "MMMM DD, YYYY")
          description
          type
          period
          major
        }
      }
    }
  }
`

export default LecturesPage

export const Head = () => <Seo title="Lectures" />