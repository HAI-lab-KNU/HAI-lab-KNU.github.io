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
          <div className="bg-surface-muted rounded-lg p-1.5 md:p-3">
            <h3 className="text-xs font-normal text-secondary mb-1 md:mb-3 text-center">Research Area</h3>
            
            <div className="flex flex-col gap-2 md:gap-3 justify-center">
              <div className="flex flex-wrap gap-0.5 md:gap-1.5 justify-center">
                {['Human-Computer Interaction', 'Ubiquitous Computing', 'Proactive System'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-1 py-0.5 rounded-full font-normal transition-all duration-300 text-xs whitespace-nowrap flex items-center gap-0.5 flex-shrink-0 ${
                      selectedTags.includes(tag)
                        ? "bg-accent-muted text-blue-700 dark:text-white dark:border dark:border-blue-500 border border-blue-300 shadow-sm"
                        : "bg-surface text-primary border border-default hover:bg-surface-subtle hover:text-accent hover:border-default"
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
                        ? "bg-accent-muted text-blue-700 dark:text-white dark:border dark:border-blue-500 border border-blue-300 shadow-sm"
                        : "bg-surface text-primary border border-default hover:bg-surface-subtle hover:text-accent hover:border-default"
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
            <div className="w-16 h-16 mx-auto mb-4 bg-surface-subtle rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-muted-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-muted-subtle text-lg font-medium">No projects found</p>
            <p className="text-muted-subtle text-sm mt-1">Try adjusting your filter criteria</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post) => {
              return (
                <article key={post.id} className="group bg-surface hover:bg-surface-subtle transition-all duration-300 py-4">
                  <Link to={post.fields.slug} className="block">
                    <div className="flex flex-col md:flex-row items-center">
                      {/* 왼쪽: 썸네일 이미지 - 흰 배경으로 통일 */}
                      <div className="w-full md:w-1/4 h-32 md:h-24 overflow-hidden bg-white rounded-lg flex-shrink-0">
                      {(post.frontmatter.thumbnail || post.frontmatter.image1) ? (
                        <div className="w-full h-full p-2 flex items-center justify-center bg-white">
                          <img
                            src={post.frontmatter.thumbnail || post.frontmatter.image1}
                            alt={post.frontmatter.title}
                            className="w-full h-full object-contain rounded group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-white text-muted-subtle group-hover:text-muted-subtle transition-colors duration-300">
                          <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-2 bg-surface-subtle rounded-full flex items-center justify-center group-hover:bg-surface-subtle transition-colors duration-300">
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
                        <h2 className="text-base md:text-lg font-normal text-secondary group-hover:text-accent transition-all duration-300 leading-tight mb-2">
                          {post.frontmatter.title}
                        </h2>
                        {/* 프로젝트 참여자 표시 */}
                        {post.frontmatter.people && post.frontmatter.people.length > 0 && (
                          <p className="text-xs text-muted mb-1">
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
                              <span key={index} className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-normal bg-surface-subtle text-primary border border-transparent">
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