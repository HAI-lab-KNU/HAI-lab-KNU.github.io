import * as React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"

const ContactPage = () => {
  return (
    <Layout activeLink="Contact">
      <div className="min-h-screen py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 md:px-6 space-y-12">

          {/* ── Contact 섹션 ── */}
          <section>
            <h2 className="text-base md:text-xl font-normal text-primary font-sans tracking-wide mb-6">
              Contact
            </h2>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/20 rounded-2xl p-8 shadow-sm border border-blue-200 dark:border-blue-800">
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
                  <svg className="w-6 h-6 text-accent flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
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
          </section>

          {/* ── Join Us 섹션 ── */}
          <section>
            <h2 className="text-base md:text-xl font-normal text-primary font-sans tracking-wide mb-6">
              Join Us
            </h2>

            <div className="space-y-6">
              {/* 소개 문구 */}
              <p className="text-base text-muted leading-relaxed">
                We are always looking for motivated students and researchers who are passionate
                about Human-AI Interaction, HCI, and AI/ML. If you are interested in joining
                HAI Lab, please read the information below and reach out to us.
              </p>

              {/* 지원 대상 카드 그리드 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 대학원생 */}
                <div className="bg-surface rounded-xl p-6 border border-default hover:border-accent/50 transition-colors duration-200">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422A12.083 12.083 0 0121 21H3a12.083 12.083 0 012.84-10.422L12 14z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-primary mb-2">Graduate Students</h3>
                  <p className="text-xs text-muted leading-relaxed">
                    We accept M.S. and Ph.D. applicants through the official admission process
                    of Kangwon National University. Strong background in CS, HCI, or related
                    fields is preferred.
                  </p>
                </div>

                {/* 학부생 */}
                <div className="bg-surface rounded-xl p-6 border border-default hover:border-accent/50 transition-colors duration-200">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-primary mb-2">Undergraduate Students</h3>
                  <p className="text-xs text-muted leading-relaxed">
                    KNU undergraduates are welcome to join as research interns. We offer
                    hands-on research experience in HCI and AI projects throughout the year.
                  </p>
                </div>

                {/* 방문 연구원 */}
                <div className="bg-surface rounded-xl p-6 border border-default hover:border-accent/50 transition-colors duration-200">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-primary mb-2">Visiting Researchers</h3>
                  <p className="text-xs text-muted leading-relaxed">
                    We occasionally host visiting researchers and collaborators from other
                    institutions. Please contact us with your research proposal and CV.
                  </p>
                </div>
              </div>

              {/* 자격 요건 */}
              <div className="bg-surface-subtle rounded-xl p-6 border border-default">
                <h3 className="text-sm font-semibold text-primary mb-4">What We Look For</h3>
                <ul className="space-y-2 text-sm text-muted">
                  <li className="flex items-start space-x-2">
                    <span className="text-accent mt-0.5 flex-shrink-0">•</span>
                    <span>Strong interest in Human-Computer Interaction (HCI), AI, or related fields</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-accent mt-0.5 flex-shrink-0">•</span>
                    <span>Programming experience (Python, JavaScript/TypeScript, or similar)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-accent mt-0.5 flex-shrink-0">•</span>
                    <span>Ability to work both independently and collaboratively in a team</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-accent mt-0.5 flex-shrink-0">•</span>
                    <span>Good written and verbal communication skills (English or Korean)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-accent mt-0.5 flex-shrink-0">•</span>
                    <span>Curiosity and enthusiasm for interdisciplinary research</span>
                  </li>
                </ul>
              </div>

              {/* 지원 방법 CTA */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800 text-center">
                <h3 className="text-base font-semibold text-primary mb-2">Interested? Let's Talk.</h3>
                <p className="text-sm text-muted mb-6 max-w-lg mx-auto">
                  Send an email to Prof. Auk Kim with your CV, a brief statement of your research
                  interests, and any relevant work (portfolio, publications, GitHub, etc.).
                </p>
                <a
                  href="mailto:kimauk@hai.kangwon.ac.kr?subject=Prospective%20Member%20Inquiry"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-accent text-white rounded-lg font-medium text-sm hover:bg-accent/90 transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span>kimauk@hai.kangwon.ac.kr</span>
                </a>
              </div>
            </div>
          </section>

        </div>
      </div>
    </Layout>
  )
}

export default ContactPage

export const Head = () => <Seo title="Contact" />
