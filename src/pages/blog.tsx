import * as React from "react"
import { graphql, PageProps, Link } from "gatsby"
import { FaCheck } from "react-icons/fa"

import Layout from "../components/layout"
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
          date: string
          description: string
          thumbnail: string
          image1: string
          image2: string
          image3: string
          image4: string
          tags?: string[]
          people: {
            name: string
            affiliation: string
            photo: string
            homepage: string
          }[]
        }
    }[]
  }
}

const BlogPage: React.FC<PageProps<DataProps>> = ({ data }) => {
  const posts = data.allMarkdownRemark.nodes
  const [selectedTags, setSelectedTags] = React.useState<string[]>([])

  // 사용 가능한 모든 태그 목록 생성 (대분류 제외)
  const availableTags = React.useMemo(() => {
    const allTags = posts
      .filter(post => post.frontmatter.tags)
      .flatMap(post => post.frontmatter.tags || [])
    const filteredTags = [...new Set(allTags)].filter(tag => 
      !['Human-Computer Interaction', 'Ubiquitous Computing', 'Proactive System'].includes(tag)
    )
    return filteredTags.sort()
  }, [posts])

  // 선택된 태그에 따라 프로젝트 필터링 (OR 로직)
  const filteredPosts = React.useMemo(() => {
    if (selectedTags.length === 0) return posts
    return posts.filter(post => 
      post.frontmatter.tags && 
      selectedTags.some(tag => post.frontmatter.tags!.includes(tag))
    )
  }, [posts, selectedTags])

  // 태그 선택/해제 핸들러
  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  return (
    <Layout activeLink="Projects">
      <div className="max-w-7xl mx-auto px-3 md:px-8 py-6 md:py-8">
        <div className="space-y-8">
        {/* 태그 필터 */}
        <div className="mb-1 md:mb-4">
          <div className="bg-gray-50 rounded-lg p-1.5 md:p-3">
            <h3 className="text-xs font-normal text-gray-700 mb-1 md:mb-3 text-center">Research Area</h3>
            
            {/* 태그 컨테이너 */}
            <div className="flex flex-col gap-2 md:gap-3 justify-center">
              {/* 대분류 태그들 (윗줄) */}
              <div className="flex flex-wrap gap-0.5 md:gap-1.5 justify-center">
                {['Human-Computer Interaction', 'Ubiquitous Computing', 'Proactive System'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-1 py-0.5 rounded-full font-normal transition-all duration-300 text-xs whitespace-nowrap flex items-center gap-0.5 flex-shrink-0 ${
                      selectedTags.includes(tag)
                        ? "bg-blue-100 text-blue-700 border border-blue-300 shadow-sm"
                        : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200"
                    }`}
                  >
                    {selectedTags.includes(tag) && (
                      <FaCheck className="w-2 h-2" />
                    )}
                    {tag}
                  </button>
                ))}
              </div>
              
              {/* 세부 태그들 (아랫줄) */}
              <div className="flex flex-wrap gap-0.5 md:gap-1.5 justify-center">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-1 py-0.5 rounded-full font-normal transition-all duration-300 text-xs whitespace-nowrap flex items-center gap-0.5 flex-shrink-0 ${
                      selectedTags.includes(tag)
                        ? "bg-blue-100 text-blue-700 border border-blue-300 shadow-sm"
                        : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200"
                    }`}
                  >
                    {selectedTags.includes(tag) && (
                      <FaCheck className="w-2 h-2" />
                    )}
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg font-medium">No projects found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your filter criteria</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post) => {
              return (
                <article key={post.id} className="group bg-white hover:bg-gray-50 transition-all duration-300 border-b border-gray-200 py-4">
                  <Link to={post.fields.slug} className="block">
                    <div className="flex flex-col md:flex-row items-center">
                      {/* 왼쪽: 썸네일 이미지 */}
                      <div className="w-full md:w-1/4 h-32 md:h-24 overflow-hidden">
                      {post.frontmatter.image1 && post.frontmatter.image2 && post.frontmatter.image3 && post.frontmatter.image4 ? (
                        // 4개 이미지: car1, car2 좌우, car3, car4 아래 좌우
                        <div className="w-full h-full flex flex-col p-2">
                          <div className="w-full h-1/2 flex gap-1">
                            <img
                              src={post.frontmatter.image1}
                              alt={`${post.frontmatter.title} - Image 1`}
                              className="w-1/2 h-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-500"
                            />
                            <img
                              src={post.frontmatter.image2}
                              alt={`${post.frontmatter.title} - Image 2`}
                              className="w-1/2 h-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <div className="w-full h-1/2 flex gap-1 mt-1">
                            <img
                              src={post.frontmatter.image3}
                              alt={`${post.frontmatter.title} - Image 3`}
                              className="w-1/2 h-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-500"
                            />
                            <img
                              src={post.frontmatter.image4}
                              alt={`${post.frontmatter.title} - Image 4`}
                              className="w-1/2 h-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        </div>
                      ) : post.frontmatter.image1 && post.frontmatter.image2 && post.frontmatter.image3 ? (
                        // 3개 이미지: car1, car2 좌우, car3 아래
                        <div className="w-full h-full flex flex-col p-2">
                          <div className="w-full h-2/3 flex gap-1">
                            <img
                              src={post.frontmatter.image1}
                              alt={`${post.frontmatter.title} - Image 1`}
                              className="w-1/2 h-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-500"
                            />
                            <img
                              src={post.frontmatter.image2}
                              alt={`${post.frontmatter.title} - Image 2`}
                              className="w-1/2 h-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <img
                            src={post.frontmatter.image3}
                            alt={`${post.frontmatter.title} - Image 3`}
                            className="w-full h-1/3 object-contain rounded-lg mt-1 group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      ) : post.frontmatter.image1 && post.frontmatter.image2 ? (
                        // IoT 프로젝트는 상하로, 다른 프로젝트는 좌우로 표시
                        <div className={`w-full h-full p-2 ${post.frontmatter.title.includes('IoT-Enabled') ? 'flex flex-col gap-1' : 'flex gap-1'}`}>
                          <img
                            src={post.frontmatter.image1}
                            alt={`${post.frontmatter.title} - Image 1`}
                            className={`${post.frontmatter.title.includes('IoT-Enabled') ? 'w-full h-1/2' : 'w-1/2 h-full'} object-contain rounded-lg group-hover:scale-105 transition-transform duration-500`}
                          />
                          <img
                            src={post.frontmatter.image2}
                            alt={`${post.frontmatter.title} - Image 2`}
                            className={`${post.frontmatter.title.includes('IoT-Enabled') ? 'w-full h-1/2' : 'w-1/2 h-full'} object-contain rounded-lg group-hover:scale-105 transition-transform duration-500`}
                          />
                        </div>
                      ) : post.frontmatter.thumbnail ? (
                        // 일반 프로젝트: 썸네일 표시
                        <div className="w-full h-full p-4 flex items-center justify-center">
                          <img
                            src={post.frontmatter.thumbnail}
                            alt={post.frontmatter.title}
                            className="w-full h-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      ) : (
                        // 이미지 없음
                        <div className="w-full h-full flex items-center justify-center text-gray-400 group-hover:text-gray-500 transition-colors duration-300">
                          <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center group-hover:bg-gray-300 transition-colors duration-300">
                              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <span className="text-sm font-medium">No Image</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                      {/* 오른쪽: 텍스트 내용 */}
                      <div className="w-full md:w-3/4 pl-4 md:pl-6 pt-4">
                        <h2 className="text-base md:text-lg font-normal text-gray-800 group-hover:text-blue-600 transition-all duration-300 leading-tight mb-2">
                          {post.frontmatter.title}
                        </h2>
                        {/* 프로젝트 참여자 표시 */}
                        {post.frontmatter.people && post.frontmatter.people.length > 0 && (
                          <p className="text-xs text-gray-600 mb-1">
                            {post.frontmatter.people.map((person, index) => (
                              <span key={index}>
                                {person.name}
                                {index < post.frontmatter.people.length - 1 ? ', ' : ''}
                              </span>
                            ))}
                          </p>
                        )}
                        {/* 프로젝트 태그 표시 */}
                        {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                          <div className="flex flex-wrap gap-0.5">
                            {post.frontmatter.tags.map((tag, index) => (
                              <span key={index} className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-normal bg-gray-100 text-gray-700">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </article>
              )
            })}
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
      filter: { fileAbsolutePath: { regex: "/content/blog/" } }
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
          date(formatString: "MMMM DD, YYYY")
          description
          thumbnail
          image1
          image2
          image3
          image4
          tags
          people {
            name
            affiliation
            photo
            homepage
          }
        }
      }
    }
  }
`

export default BlogPage

export const Head = () => <Seo title="HAI LAB" /> 