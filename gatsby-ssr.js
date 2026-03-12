/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-ssr/
 */

const React = require('react')

/**
 * 다크모드: 첫 페인트 전에 localStorage에서 theme을 읽어 html에 class 적용 (깜빡임 방지)
 */
const themeScript = (
  <script
    key="theme-init"
    dangerouslySetInnerHTML={{
      __html: `(function(){var t=typeof localStorage!=='undefined'&&localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}})();`,
    }}
  />
)

/**
 * @type {import('gatsby').GatsbySSR['onRenderBody']}
 */
exports.onRenderBody = ({ setHtmlAttributes, setHeadComponents }) => {
  setHtmlAttributes({ lang: `en` })
  setHeadComponents([themeScript])
}
