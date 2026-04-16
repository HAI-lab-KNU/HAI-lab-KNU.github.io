import * as React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

const NotFoundPage: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="page-title mb-4">404: Not Found</h1>
        <p className="body-text mb-8">You just hit a route that doesn't exist.</p>
        <Link to="/" className="btn-primary">Go back home</Link>
      </div>
    </Layout>
  )
}

export const Head: React.FC = () => <Seo title="404 Not Found" />

export default NotFoundPage
