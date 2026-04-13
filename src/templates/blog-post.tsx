import * as React from "react"
import { useState, useEffect } from "react"
import { Link, graphql } from "gatsby"
import { FaFilePdf, FaHome, FaPlay, FaGithub, FaPython, FaJava, FaAndroid } from "react-icons/fa"
import { SiJupyter } from "react-icons/si"

import Layout from "../components/layout"
import Seo from "../components/seo"
import StickyIndex, { StickyIndexItem } from "../components/StickyIndex"

interface BlogPostTemplateProps {
  data: {
    previous: any
    next: any
    site: any
    markdownRemark: any
  }
  location: any
}

const BlogPostTemplate: React.FC<BlogPostTemplateProps> = ({
  data: { previous, next, site, markdownRemark: post },
  location,
}) => {
  const siteTitle = site.siteMetadata?.title || `Title`
  const [activeSection, setActiveSection] = useState('abstract')

  const indexItems = React.useMemo<StickyIndexItem[]>(() => {
    const items: StickyIndexItem[] = []
    if (post.frontmatter.description) items.push({ id: 'abstract', label: 'Abstract' })
    if (post.frontmatter.publications?.some(p => p.title?.trim())) items.push({ id: 'publications', label: 'Publications' })
    if (post.frontmatter.datasets?.some(d => d.title?.trim())) items.push({ id: 'datasets', label: 'Datasets' })
    if (post.frontmatter.sourcecode?.some(c => c.title?.trim())) items.push({ id: 'sourcecode', label: 'Source Code' })
    if (post.frontmatter.people?.length) items.push({ id: 'people', label: 'People' })
    return items
  }, [post.frontmatter])

  // 현재 보이는 섹션을 추적하는 함수
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-20% 0px -70% 0px' // 네비게이션 바를 고려한 여백
      }
    )

    // 모든 섹션을 관찰
    const sections = document.querySelectorAll('section[id]')
    sections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [])

  return (
    <Layout location={location} title={siteTitle}>
      <div className="relative w-full max-w-7xl mx-auto px-3 md:px-8 py-6 md:py-8">
        <div className="flex">
                  {/* 메인 콘텐츠 */}
        <article className="flex-1 w-full">
        {/* 제목 섹션 */}
        <header className="text-center mb-12">
          <h1 className="text-3xl font-normal text-primary mb-6">
            {post.frontmatter.title}
          </h1>
        </header>






        {/* 썸네일 이미지 섹션 */}
        {(post.frontmatter.image1 || post.frontmatter.thumbnail) && (
          <section className="mb-8 md:mb-12">
            <div className="w-full">
              <div className="w-full h-64 md:h-80 overflow-hidden">
                <img
                  src={post.frontmatter.image1 || post.frontmatter.thumbnail}
                  alt={post.frontmatter.title}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </section>
        )}
        


        {/* Abstract 섹션 */}
        {post.frontmatter.description && (
          <section id="abstract" className="mb-8 md:mb-12">
            <h2 className="text-xl font-normal text-primary mb-4 md:mb-6">Abstract</h2>
            <div className="bg-surface-muted rounded-lg p-4 md:p-6">
              <p className="text-sm md:text-base text-muted leading-relaxed">
                {post.frontmatter.description}
              </p>
            </div>
          </section>
        )}

        {/* Publications 섹션 - 실제 내용이 있을 때만 표시 */}
        {post.frontmatter.publications && 
         post.frontmatter.publications.length > 0 && 
         post.frontmatter.publications.some(pub => pub.title && pub.title.trim() !== '') && (
          <section id="publications" className="mb-6 md:mb-8">
            <h2 className="text-xl font-normal text-primary mb-3 md:mb-4">Publications</h2>
            <div className="space-y-2 md:space-y-3">
              {post.frontmatter.publications
                .filter(pub => pub.title && pub.title.trim() !== '')
                .map((pub, index) => (
                <div key={index} className="bg-surface border border-default rounded-lg p-3 md:p-4 shadow-sm hover:bg-surface-subtle transition-colors duration-200">
                  {pub.doi ? (
                    <a
                      href={pub.doi.startsWith('http') ? pub.doi : `https://doi.org/${pub.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <h3 className="text-sm md:text-base font-normal text-primary mb-1 hover:text-accent transition-colors duration-200 cursor-pointer">
                        {pub.title}
                      </h3>
                    </a>
                  ) : (
                    <h3 className="text-sm md:text-base font-normal text-primary mb-1">
                      {pub.title}
                    </h3>
                  )}
                  <p className="text-muted text-xs mb-1">{pub.authors}</p>
                  <p className="text-muted-subtle text-xs mb-2">{pub.venue}</p>
                  
                  {/* PDF/Code/Video 버튼들 */}
                  <div className="flex space-x-2">
                    {pub.pdf && pub.pdf.trim() !== '' && (
                      <a
                        href={pub.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 border border-red-200 text-xs font-medium rounded-md hover:bg-red-200 hover:border-red-300 transition-all duration-200"
                      >
                        <FaFilePdf className="mr-1 w-2.5 h-2.5" />
                        PDF
                      </a>
                    )}
                    {pub.video && pub.video.trim() !== '' && (
                      <a
                        href={pub.video}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 border border-blue-200 text-xs font-medium rounded-md hover:bg-blue-200 hover:border-blue-300 transition-all duration-200"
                      >
                        <FaPlay className="mr-1 w-2.5 h-2.5" />
                        Video
                      </a>
                    )}

                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Articles 섹션 - 실제 내용이 있을 때만 표시 */}
        {post.frontmatter.articles && 
         post.frontmatter.articles.length > 0 && 
         post.frontmatter.articles.some(article => article.title && article.title.trim() !== '') && (
          <section className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-normal text-primary mb-3 md:mb-4">Articles</h2>
            <div className="space-y-2 md:space-y-3">
              {post.frontmatter.articles
                .filter(article => article.title && article.title.trim() !== '')
                .map((article, index) => (
                <div key={index} className="bg-surface border border-default rounded-lg p-3 md:p-4 shadow-sm hover:bg-surface-subtle transition-colors duration-200">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <h3 className="text-base md:text-lg font-normal text-primary mb-1 hover:text-accent transition-colors duration-200 cursor-pointer">
                      {article.title}
                    </h3>
                  </a>
                  <p className="text-muted text-xs md:text-sm mb-1">{article.source} • {article.date}</p>
                  
                  {/* Article Link 버튼 */}
                  <div className="flex space-x-2">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-2 py-1 bg-green-500 text-white text-xs font-medium rounded hover:bg-green-600 transition-colors duration-200"
                    >
                      <FaHome className="mr-1 w-2.5 h-2.5" />
                      Read Article
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Dataset 섹션 - 실제 내용이 있을 때만 표시 */}
        {post.frontmatter.datasets && 
         post.frontmatter.datasets.length > 0 && 
         post.frontmatter.datasets.some(dataset => dataset.title && dataset.title.trim() !== '') && (
          <section id="datasets" className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-normal text-primary mb-3 md:mb-4">Datasets</h2>
            <div className="space-y-2 md:space-y-3">
              {post.frontmatter.datasets
                .filter(dataset => dataset.title && dataset.title.trim() !== '')
                .map((dataset, index) => (
                <div key={index} className="bg-surface border border-default rounded-lg p-3 md:p-4 shadow-sm hover:bg-surface-subtle transition-colors duration-200">
                  {dataset.zenodo ? (
                    <a
                      href={dataset.zenodo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <h3 className="text-base md:text-lg font-normal text-primary mb-2 hover:text-accent transition-colors duration-200">
                        {dataset.title}
                      </h3>
                    </a>
                  ) : (
                    <h3 className="text-base md:text-lg font-normal text-primary mb-2">
                      {dataset.title}
                    </h3>
                  )}
                  

                </div>
              ))}
            </div>
          </section>
        )}

        {/* Source Code 섹션 - 실제 내용이 있을 때만 표시 */}
        {post.frontmatter.sourcecode && 
         post.frontmatter.sourcecode.length > 0 && 
         post.frontmatter.sourcecode.some(code => code.title && code.title.trim() !== '') && (
          <section id="sourcecode" className="mb-6 md:mb-8">
            <h2 className="text-xl font-normal text-primary mb-3 md:mb-4">Source Code</h2>
            <div className="space-y-2 md:space-y-3">
              {post.frontmatter.sourcecode
                .filter(code => code.title && code.title.trim() !== '')
                .map((code, index) => (
                <div key={index} className="bg-surface border border-default rounded-lg p-3 md:p-4 shadow-sm hover:bg-surface-subtle transition-colors duration-200">
                  {code.github ? (
                    <a
                      href={code.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <h3 className="text-base md:text-lg font-normal text-primary mb-2 hover:text-accent transition-colors duration-200">
                        {code.title}
                      </h3>
                    </a>
                  ) : (
                    <h3 className="text-base md:text-lg font-normal text-primary mb-2">
                      {code.title}
                    </h3>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* People 섹션 */}
        {post.frontmatter.people && post.frontmatter.people.length > 0 && (
          <section id="people" className="mb-8 md:mb-12">
            <h2 className="text-xl font-normal text-primary mb-4 md:mb-6">People</h2>
            <div className="flex justify-center">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 max-w-6xl">
                {post.frontmatter.people.map((person, index) => {
                  // 이름을 기반으로 static 폴더의 이미지 경로 생성
                  const getImagePath = (name) => {
                    const nameMap = {
                      'Auk Kim': 'auk-kim.jpeg',
                      'Dongju Son': 'dongju-son.png',
                      'Golibjon Sunatlaev': 'golibjon-sunatlaev.png',
                      'Jiwoo Hwang': 'jiwoo-hwang.jpeg',
                      'Jiwook Lee': 'jiwook-lee.jpg',
                      'Jungmin Lee': 'jungmin-lee.png',
                      'Kyoyoung Choi': 'kyoyoung-choi.jpg',
                      'Mingyu Han': 'mingyu-han.jpeg',
                      'Minji Kim': 'minji-kim.jpg',
                      'Minyoung Kim': 'minyoung-kim.jpg',
                      'Seongeun Lee': 'seongeun-lee.png',
                      'Yeongju Mun': 'yeongju-mun.jpg',
                      'Younghwan Kim': 'younghwan-kim.png'
                    };
                    return nameMap[name] ? `/images/members/${nameMap[name]}` : null;
                  };
                  
                  const imagePath = getImagePath(person.name);
                  
                  return (
                    <div key={index} className="text-center">
                      <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 mx-auto mb-3 rounded-full overflow-hidden border-2 border-default bg-surface-subtle">
                        {imagePath ? (
                          <img
                            src={imagePath}
                            alt={person.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className={`w-full h-full bg-surface-subtle flex items-center justify-center ${imagePath ? 'hidden' : 'flex'}`}>
                          <span className="text-muted text-lg md:text-xl font-bold">
                            {person.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <h3 className="font-normal text-primary mb-1 text-xs md:text-sm">
                        {person.name}
                      </h3>
                      <p className="text-muted text-xs mb-2">{person.affiliation}</p>
                      {person.homepage && (
                        <a
                          href={person.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-accent hover:text-accent transition-colors duration-200"
                        >
                          <FaHome className="w-2 h-2 md:w-3 md:h-3" />
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        </article>

        <StickyIndex items={indexItems} activeId={activeSection} top="8rem" />
        </div>
      </div>
    </Layout>
  )
}

export const Head: React.FC<{ data: { markdownRemark: any } }> = ({ data: { markdownRemark: post } }) => {
  return (
    <Seo
      title={post.frontmatter.title}
      description={post.frontmatter.description || post.excerpt}
    />
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id } ) {
      id
      excerpt(pruneLength: 160)
      html
              frontmatter {
          title
          date(formatString: "MMMM DD, YYYY")
          description
          thumbnail
          image1
          image2
          image3
          image4
          publications {
            title
            authors
            venue
            pdf
            video
            code
            doi
          }
          articles {
            title
            source
            date
            url
            description
          }
          people {
            name
            affiliation
            photo
            homepage
          }
          datasets {
            title
            description
            zenodo
            size
            license
          }
          sourcecode {
            title
            description
            language
            framework
            github
          }
        }
    }
    previous: markdownRemark(id: { eq: $previousPostId } ) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId } ) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`
