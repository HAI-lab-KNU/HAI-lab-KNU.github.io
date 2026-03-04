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

  // 사용 가능한 연도들 (2020-2025)
  const availableYears = Array.from({ length: 6 }, (_, i) => (2025 - i).toString())

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

  // 필터링된 강의들
  const filteredLectures = lectures.filter((lecture) => {
    const lectureType = getTypeFromMajor(lecture.frontmatter.major)
    const lectureYear = new Date(lecture.frontmatter.date).getFullYear().toString()
    
    const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(lectureType)
    const yearMatch = (!startYear || lectureYear >= startYear) && (!endYear || lectureYear <= endYear)
    
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
          onStartYearChange={setStartYear}
          onEndYearChange={setEndYear}
          selectedTypes={selectedTypes}
          onTypeChange={handleTypeToggle}
          availableTypes={availableTypes}
          availableYears={availableYears}
          typeLabel="Lecture Type"
        />



        {sortedLectures.length === 0 ? (
          <p className="text-gray-600 text-center">No lectures match the selected filters.</p>
        ) : (
          <div className="space-y-24">
            {sortedLectures.map((lecture) => (
              <div key={lecture.id} className="border-b border-gray-100 pb-16">
                <h2 className="text-base md:text-lg font-normal text-gray-800 leading-tight mb-2">
                  {lecture.frontmatter.title}
                </h2>
                <p className="text-sm md:text-base font-light text-gray-600 mb-2">
                  {lecture.frontmatter.description || lecture.excerpt}
                </p>
                <div className="flex items-start space-x-4">
                  {lecture.frontmatter.major === true && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                      Major
                    </span>
                  )}
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
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

export const Head = () => <Seo title="HAI LAB" /> 