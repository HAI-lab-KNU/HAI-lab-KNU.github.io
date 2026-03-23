import * as React from "react"
import { Link, graphql } from "gatsby"
import { FaRobot } from "react-icons/fa"
import { HiOutlineGlobeAlt, HiOutlineChip } from "react-icons/hi"
import Layout from "../components/layout"
import Seo from "../components/seo"

/** WebGL 번들은 클라이언트에서만 로드 (SSR/정적 HTML에서는 CSS 폴백) */
const HeroShaderBackground = React.lazy(() => import("../components/HeroShaderBackground"))

interface IndexPageProps {
  data: any
}

const IndexPage: React.FC<IndexPageProps> = ({ data }) => {
  const posts = data.allMarkdownRemark.nodes.slice(0, 3) // 최신 프로젝트 3개로 되돌림
  const news = data.allNews.nodes.slice(0, 3) // 최신 뉴스 3개
  const members = data.allMembers.nodes // 멤버 정보

  return (
    <>
      {/* Hero Section - 셰이더 배경 + 텍스트 + 워드클라우드 */}
      <section className="relative pt-40 pb-8 w-full overflow-hidden">
        <React.Suspense
          fallback={
            <div
              className="absolute inset-0 -z-10 bg-gradient-to-br from-white via-sky-50 to-slate-50"
              aria-hidden
            />
          }
        >
          <HeroShaderBackground />
        </React.Suspense>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            <div
              className="text-left rounded-2xl bg-white/85 backdrop-blur-md border border-white/60 shadow-sm px-5 py-6 md:px-7 md:py-8 dark:border-transparent dark:bg-black/12 dark:shadow-none dark:backdrop-blur-2xl"
            >
              <h1 className="text-3xl md:text-5xl font-light text-primary mb-6" id="main-heading">
               Human-AI Interaction Lab 
              </h1>
              <p className="text-base text-muted leading-relaxed font-light mb-8">
                We focus on how to design meaningful human interactions with AI systems in everyday life.
                Our goal is making proactive AI agents that understand user context and behavior to give helpful suggestions, like <em>JARVIS</em> from Iron Man.
              </p>
              
              <div className="space-y-4">
                <h2 className="text-lg font-light text-secondary mb-4">Research Areas</h2>
                <div className="flex flex-wrap justify-start gap-2">
                  <span className="inline-block px-3 py-1 text-xs font-light bg-surface text-primary rounded-full border border-default">
                    Human-Computer Interaction
                  </span>
                  <span className="inline-block px-3 py-1 text-xs font-light bg-surface text-primary rounded-full border border-default">
                    Ubiquitous Computing
                  </span>
                  <span className="inline-block px-3 py-1 text-xs font-light bg-surface text-primary rounded-full border border-default">
                    Proactive Systems
                  </span>
                </div>
              </div>
            </div>

            <div className="text-left max-w-sm mx-auto md:mx-0 md:ml-auto">
              <img
                src="/images/wctransparent.png"
                alt="HAI Lab Research Keywords Word Cloud"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      <Layout activeLink="Home">
        {/* Recent Projects Section */}
        <section className="pt-16 pb-8 bg-page transition-colors duration-300" aria-labelledby="recent-projects-heading">
          <div className="w-full max-w-7xl mx-auto px-6 md:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-light text-primary mb-6" id="recent-projects-heading">
                Recent Projects
              </h2>
            </div>
            {posts.length > 0 ? (
              <>
                <div className="grid md:grid-cols-3 gap-4 md:gap-8">
                  {posts.map((post) => {
                    return (
                      <Link 
                        to={post.fields.slug} 
                        key={post.id} 
                        className="block bg-surface rounded-lg p-3 md:p-4 shadow-sm hover:shadow-lg border border-default hover:border-default transition-all duration-300 cursor-pointer"
                      >
                        {/* 썸네일 - 흰 배경으로 통일 */}
                        <div className="mb-3">
                          <div className="w-full h-24 md:h-40 rounded-lg overflow-hidden shadow-sm bg-white">
                            {(post.frontmatter.thumbnail || post.frontmatter.image1) ? (
                              <div className="w-full h-full p-2 flex items-center justify-center bg-white">
                                <img
                                  src={post.frontmatter.thumbnail || post.frontmatter.image1}
                                  alt={post.frontmatter.title}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-white text-muted-subtle">
                                <span className="text-xs md:text-sm">No Image</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* 프로젝트 제목과 태그 */}
                        <div className="text-center">
                          <h3 className="text-base md:text-lg font-bold text-primary mb-2">
                            {post.frontmatter.title}
                          </h3>
                          {/* 프로젝트 태그 표시 */}
                          {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-1">
                              {post.frontmatter.tags.map((tag, index) => (
                                <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-surface-subtle text-primary">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {/* 참여자 정보 */}
                        {post.frontmatter.people && post.frontmatter.people.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-border-muted">
                            <div className="flex items-center justify-center">
                              <div className="flex -space-x-1">
                                {post.frontmatter.people.slice(0, 4).map((person, index) => {
                                  // 멤버 정보에서 해당 참여자 찾기
                                  const member = members.find(m => 
                                    m.frontmatter.name.toLowerCase() === person.name.toLowerCase()
                                  )
                                  
                                  // 멤버 정보가 있으면 멤버의 photo 사용, 없으면 기존 photo 사용
                                  const imagePath = member?.frontmatter.photo 
                                    ? `/images/members/${member.frontmatter.photo}`
                                    : person.photo || "/images/profile-pic.png"
                                  
                                  return (
                                    <div key={index} className="relative group">
                                      <img
                                        src={imagePath}
                                        alt={person.name}
                                        className="w-6 h-6 rounded-full border border-white object-cover shadow-sm transition-transform duration-200"
                                        title={person.name}
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).src = "/images/profile-pic.png"
                                        }}
                                      />
                                      {/* 툴팁 */}
                                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-surface text-primary text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                                        {person.name}
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-surface"></div>
                                      </div>
                                    </div>
                                  )
                                })}
                                {post.frontmatter.people.length > 4 && (
                                  <div className="w-6 h-6 rounded-full bg-surface-subtle border border-default flex items-center justify-center shadow-sm">
                                    <span className="text-xs text-primary font-medium">
                                      +{post.frontmatter.people.length - 4}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </Link>
                    )
                  })}
                </div>
                
                {/* View All 링크를 프로젝트들 아래에 배치 */}
                <div className="text-center mt-8">
                  <Link
                    to="/blog"
                    className="inline-block text-accent hover:text-accent font-medium focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-page rounded px-4 py-2 transition-all duration-200"
                  >
                    View All Projects
                  </Link>
                </div>
              </>
            ) : (
              <div className="bg-surface rounded-lg p-6 shadow-sm border border-default">
                <p className="text-muted text-center py-8">
                  최근 프로젝트가 여기에 표시됩니다.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* 구분선 */}
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <hr className="border-default opacity-50 my-8" />
        </div>
      </Layout>
    </>
  )
}

export default IndexPage

export const query = graphql`
  {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/content/blog/" } }
      sort: { frontmatter: { date: DESC } }
      limit: 3
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
    allMembers: allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/content/members/" } }
      sort: { frontmatter: { name: ASC } }
    ) {
      nodes {
        frontmatter {
          name
          photo
        }
      }
    }
    allNews: allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/content/news/" } }
      sort: { frontmatter: { date: DESC } }
      limit: 3
    ) {
      nodes {
        id
        excerpt
        frontmatter {
          title
          date(formatString: "MMMM DD, YYYY")
          description
          thumbnail
        }
      }
    }
  }
`

export const Head: React.FC = () => <Seo title="HAI LAB" />
