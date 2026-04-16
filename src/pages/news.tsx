import * as React from "react"
import { graphql, PageProps, Link } from "gatsby"

import Layout from "../components/layout"

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
      }
    }[]
  }
}

const NewsPage: React.FC<PageProps<DataProps>> = ({ data }) => {
  const news = data.allMarkdownRemark.nodes

  return (
    <Layout activeLink="News">
      <div className="space-y-8">
        {news.length === 0 ? (
          <p className="text-muted">No news available yet.</p>
        ) : (
          <div className="space-y-6">
            {news.map((item) => {
              return (
                <article key={item.id} className="border-b border-default pb-6 group hover:bg-surface-subtle rounded-lg p-4 -m-4 transition-all duration-300 hover:shadow-md">
                  <Link to={item.fields.slug} className="block">
                    <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-8">
                      {/* 썸네일 이미지 - 모바일에서는 위에, 데스크톱에서는 오른쪽 */}
                      <div className="flex-shrink-0 mx-auto md:mx-0">
                        <div className="w-48 h-32 md:w-56 md:h-36 rounded-lg overflow-hidden bg-surface-subtle shadow-sm group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                          {item.frontmatter.thumbnail ? (
                            <img
                              src={item.frontmatter.thumbnail}
                              alt={item.frontmatter.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-subtle bg-surface-muted group-hover:bg-surface-subtle transition-colors duration-300">
                              <span className="text-sm">No Image</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* 텍스트 내용 - 모바일에서는 아래에, 데스크톱에서는 왼쪽 */}
                      <div className="flex-1 min-w-0 text-center md:text-left">
                        <h2 className="card-title group-hover:text-accent transition-all duration-300 mb-3 group-hover:translate-x-1">
                          {item.frontmatter.title}
                        </h2>
                        <p className="label-text text-muted-subtle mb-3 group-hover:text-muted transition-colors duration-300">
                          {item.frontmatter.date}
                        </p>
                        <p className="body-text group-hover:text-secondary transition-colors duration-300">
                          {item.frontmatter.description || item.excerpt}
                        </p>
                      </div>
                    </div>
                  </Link>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </Layout>
  )
}

export const query = graphql`
  {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/content/news/" } }
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
        }
      }
    }
  }
`

export default NewsPage 