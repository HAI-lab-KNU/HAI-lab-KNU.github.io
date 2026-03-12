import * as React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"

const ContactPage = () => {
  return (
    <Layout activeLink="Contact">
      <div className="min-h-screen py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          {/* 연락처 정보 섹션 */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 shadow-sm border border-blue-200">
              <div className="space-y-6">
                {/* 이메일 */}
                <div className="flex items-center space-x-4">
                  <svg className="w-6 h-6 text-accent flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <div>
                    <p className="text-sm text-muted mb-1">Email</p>
                    <a 
                      href="mailto:kimauk@hai.kangwon.ac.kr"
                      className="text-lg font-medium text-accent hover:text-accent transition-colors duration-200 select-none"
                    >
                      kimauk@hai.kangwon.ac.kr
                    </a>
                  </div>
                </div>
                
                {/* 위치 */}
                <div className="flex items-center space-x-4">
                  <svg className="w-6 h-6 text-accent flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm text-muted mb-1">Location</p>
                    <p className="text-lg font-medium text-primary">
                      Room 512, College of Engineering 6
                    </p>
                  </div>
                </div>

                {/* 주소 */}
                <div className="flex items-start space-x-4">
                  <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm text-muted mb-1">Address</p>
                    <p className="text-lg font-medium text-primary">
                      Kangwon National University College of Engineering 6, Room 512<br />
                      1 Gangwondaehakgil, Chuncheon-si, Gangwon-do (24341)<br />
                      Republic of Korea
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ContactPage

 