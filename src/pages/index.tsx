import * as React from "react"
import { Link, graphql } from "gatsby"
import { FaRobot } from "react-icons/fa"
import { HiOutlineGlobeAlt, HiOutlineChip } from "react-icons/hi"
import Layout from "../components/layout"
import Seo from "../components/seo"

import HeroShaderBackground from "../components/HeroShaderBackground"

interface IndexPageProps {
  data: any
}

const IndexPage: React.FC<IndexPageProps> = ({ data }) => {
  const posts = data.allMarkdownRemark.nodes.slice(0, 3) // 최신 프로젝트 3개로 되돌림
  const news = data.allNews.nodes.slice(0, 3) // 최신 뉴스 3개
  const members = data.allMembers.nodes // 멤버 정보

  return (
    <>
      {/* Hero Section - 셰이더 배경 + 텍스트 */}
      <section className="relative pt-40 pb-8 w-full overflow-hidden">
        <HeroShaderBackground />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid md:grid-cols-1 gap-8 md:gap-16 items-center max-w-3xl">
            <div
              className="text-left px-5 py-6 md:px-7 md:py-8"
            >
              <h1 className="page-title mb-6 text-black dark:text-white" id="main-heading">
               Human-AI Interaction Lab
              </h1>
              <p className="body-text mb-8 text-[#0b1020] dark:text-slate-100">
                We focus on how to design meaningful human interactions with AI systems in everyday life.
                Our goal is making proactive AI agents that understand user context and behavior to give helpful suggestions, like <em>JARVIS</em> from Iron Man.
              </p>
              
              <div className="space-y-4">
                <h2 className="list-title mb-4 text-[#0b1020] dark:text-slate-100">Research Areas</h2>
                <div className="flex flex-wrap justify-start gap-2">
                  <span className="btn-badge font-light">
                    Human-Computer Interaction
                  </span>
                  <span className="btn-badge font-light">
                    Ubiquitous Computing
                  </span>
                  <span className="btn-badge font-light">
                    Proactive Systems
                  </span>
                </div>
              </div>
            </div>

            {/* 워드클라우드 — 다시 켤 때 md:grid-cols-2 + 아래 블록 복구
            <div className="text-left max-w-sm mx-auto md:mx-0 md:ml-auto">
              <img
                src="/images/wctransparent.png"
                alt="HAI Lab Research Keywords Word Cloud"
                className="w-full h-auto"
              />
            </div>
            */}
          </div>
        </div>
      </section>

      <Layout activeLink="Home">
        {/* Recent Projects Section */}
        <section className="pt-16 pb-8 bg-page transition-colors duration-300" aria-labelledby="recent-projects-heading">
          <div className="w-full max-w-7xl mx-auto px-6 md:px-8">
            <div className="text-center mb-12">
              <h2 className="section-title mb-6" id="recent-projects-heading">
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
                          <h3 className="card-title mb-2">
                            {post.frontmatter.title}
                          </h3>
                          {/* 프로젝트 태그 표시 */}
                          {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-1">
                              {post.frontmatter.tags.map((tag, index) => (
                                <span key={index} className="btn-link-tag bg-surface-subtle text-primary hover:bg-surface-muted">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                      </Link>
                    )
                  })}
                </div>

                {/* View All 링크를 프로젝트들 아래에 배치 */}
                <div className="text-center mt-8">
                  <Link
                    to="/blog"
                    className="btn-ghost"
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

export const Head: React.FC = () => <Seo title="Home" />
