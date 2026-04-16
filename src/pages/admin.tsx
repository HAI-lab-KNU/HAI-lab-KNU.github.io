import * as React from "react"
import { useState } from "react"
import { graphql, PageProps } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"

interface Member {
  id: string
  name: string
  position: string
  email: string
  photo: string
  homepage: string
  googleScholar: string
  graduation?: string
  current?: string
  research_interests: string[]
}

interface DataProps {
  allMarkdownRemark: {
    nodes: {
      id: string
      frontmatter: {
        name: string
        position: string
        email: string
        photo: string
        homepage: string
        googleScholar: string
        research_interests: string[]
      }
    }[]
  }
}

interface NewMember {
  name: string
  position: string
  email: string
  photo: string
  homepage: string
  googleScholar: string
  graduation: string
  current: string
  research_interests: string[]
}

interface Publication {
  id: string
  title: string
  authors: string
  journal: string
  year: number
  doi?: string
  paper?: string
  abstract?: string
}

interface Lecture {
  id: string
  title: string
  date: string
  description: string
  content?: string
}

interface Project {
  id: string
  title: string
  date: string
  description: string
  thumbnail?: string
  image1?: string
  image2?: string
  image3?: string
  image4?: string
  tags?: string[]
  people?: Array<{
    name: string
    affiliation: string
    photo?: string
    homepage?: string
  }>
}

interface DataProps {
  allMarkdownRemark: {
    nodes: {
      id: string
      frontmatter: {
        name: string
        position: string
        email: string
        photo: string
        homepage: string
        googleScholar: string
        research_interests: string[]
        // Publications fields
        title?: string
        authors?: string
        journal?: string
        year?: number
        doi?: string
        paper?: string
        abstract?: string
        // Lectures fields
        date?: string
        description?: string
      }
      fileAbsolutePath: string
    }[]
  }
}

const AdminPage: React.FC<PageProps<DataProps>> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'members' | 'publications' | 'lectures' | 'projects'>('members')
  const [showAddForm, setShowAddForm] = useState<boolean>(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [newMember, setNewMember] = useState<NewMember>({
    name: "",
    position: "Undergraduate Student",
    email: "",
    photo: "",
    homepage: "",
    googleScholar: "",
    graduation: "",
    current: "",
    research_interests: []
  })

  // 데이터를 타입별로 분리
  const members: Member[] = data.allMarkdownRemark.nodes
    .filter(node => node.fileAbsolutePath.includes('/content/members/'))
    .map(node => ({
      id: node.id,
      name: node.frontmatter.name,
      position: node.frontmatter.position,
      email: node.frontmatter.email,
      photo: node.frontmatter.photo,
      homepage: node.frontmatter.homepage,
      googleScholar: node.frontmatter.googleScholar,
      graduation: undefined,
      current: undefined,
      research_interests: node.frontmatter.research_interests || []
    }))

  const publications: Publication[] = data.allMarkdownRemark.nodes
    .filter(node => node.fileAbsolutePath.includes('/content/publications/'))
    .map(node => ({
      id: node.id,
      title: node.frontmatter.title || '',
      authors: node.frontmatter.authors || '',
      journal: node.frontmatter.journal || '',
      year: node.frontmatter.year || 0,
      doi: node.frontmatter.doi,
      paper: node.frontmatter.paper,
      abstract: node.frontmatter.abstract
    }))

  const lectures: Lecture[] = data.allMarkdownRemark.nodes
    .filter(node => node.fileAbsolutePath.includes('/content/lectures/'))
    .map(node => ({
      id: node.id,
      title: node.frontmatter.title || '',
      date: node.frontmatter.date || '',
      description: node.frontmatter.description || '',
      content: undefined
    }))

  const projects: Project[] = data.allMarkdownRemark.nodes
    .filter(node => node.fileAbsolutePath.includes('/content/blog/'))
    .map(node => ({
      id: node.id,
      title: node.frontmatter.title || '',
      date: node.frontmatter.date || '',
      description: node.frontmatter.description || '',
      thumbnail: node.frontmatter.thumbnail,
      image1: node.frontmatter.image1,
      image2: node.frontmatter.image2,
      image3: node.frontmatter.image3,
      image4: node.frontmatter.image4,
      tags: node.frontmatter.tags || [],
      people: node.frontmatter.people || []
    }))

  const handleAddMember = (): void => {
    // 실제로는 파일 시스템에 MD 파일 생성
    console.log("새 멤버 추가:", newMember)
    alert("멤버 추가 기능은 개발 중입니다. 현재는 MD 파일을 직접 편집해주세요.")
    setShowAddForm(false)
    setNewMember({
      name: "",
      position: "Undergraduate Student",
      email: "",
      photo: "",
      homepage: "",
      googleScholar: "",
      graduation: "",
      current: "",
      research_interests: []
    })
  }

  const handleEditMember = (member: Member): void => {
    setEditingMember(member)
    setNewMember({
      name: member.name,
      position: member.position,
      email: member.email,
      photo: member.photo,
      homepage: member.homepage,
      googleScholar: member.googleScholar,
      graduation: member.graduation || "",
      current: member.current || "",
      research_interests: member.research_interests
    })
    setShowAddForm(true)
  }

  const handleDeleteMember = (memberId: string): void => {
    if (window.confirm("정말로 이 멤버를 삭제하시겠습니까?")) {
      console.log("멤버 삭제:", memberId)
      alert("멤버 삭제 기능은 개발 중입니다. 현재는 MD 파일을 직접 삭제해주세요.")
    }
  }

  const handleUpdateMember = (): void => {
    if (!editingMember) return
    
    console.log("멤버 수정:", editingMember.id, newMember)
    alert("멤버 수정 기능은 개발 중입니다. 현재는 MD 파일을 직접 편집해주세요.")
    setShowAddForm(false)
    setEditingMember(null)
  }

  const handleInputChange = (field: keyof NewMember, value: string): void => {
    if (field === 'research_interests') {
      setNewMember({
        ...newMember,
        research_interests: value.split(",").map(s => s.trim()).filter(s => s)
      })
    } else {
      setNewMember({
        ...newMember,
        [field]: value
      })
    }
  }

  return (
    <Layout activeLink="Admin">
        <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="page-title mb-2">HAI Lab 관리</h1>
          <p className="body-text">멤버, 출판물, 강의를 관리할 수 있습니다.</p>
        </div>

        {/* 탭 네비게이션 */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('members')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'members'
                  ? 'border-blue-500 text-accent'
                  : 'border-transparent text-muted-subtle hover:text-secondary hover:border-gray-300'
              }`}
            >
              멤버 ({members.length})
            </button>
            <button
              onClick={() => setActiveTab('publications')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'publications'
                  ? 'border-blue-500 text-accent'
                  : 'border-transparent text-muted-subtle hover:text-secondary hover:border-gray-300'
              }`}
            >
              출판물 ({publications.length})
            </button>
            <button
              onClick={() => setActiveTab('lectures')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'lectures'
                  ? 'border-blue-500 text-accent'
                  : 'border-transparent text-muted-subtle hover:text-secondary hover:border-gray-300'
              }`}
            >
              강의 ({lectures.length})
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'projects'
                  ? 'border-blue-500 text-accent'
                  : 'border-transparent text-muted-subtle hover:text-secondary hover:border-gray-300'
              }`}
            >
              프로젝트 ({projects.length})
            </button>
          </nav>
        </div>

        {/* 추가 버튼 */}
        <div className="mb-6">
          {activeTab === 'members' && (
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary"
            >
              + 새 멤버 추가
            </button>
          )}
          {activeTab === 'publications' && (
            <button
              onClick={() => alert('출판물 추가 기능은 개발 중입니다.')}
              className="btn-primary"
            >
              + 새 출판물 추가
            </button>
          )}
          {activeTab === 'lectures' && (
            <button
              onClick={() => alert('강의 추가 기능은 개발 중입니다.')}
              className="btn-primary"
            >
              + 새 강의 추가
            </button>
          )}
          {activeTab === 'projects' && (
            <button
              onClick={() => alert('프로젝트 추가 기능은 개발 중입니다.')}
              className="btn-primary"
            >
              + 새 프로젝트 추가
            </button>
          )}
        </div>

        {/* 멤버 추가/수정 폼 */}
        {showAddForm && activeTab === 'members' && (
          <div className="bg-surface border border-default rounded-lg p-6 mb-6">
            <h2 className="card-title mb-4">
              {editingMember ? "멤버 수정" : "새 멤버 추가"}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-secondary mb-1">이름</label>
                <input
                  id="name"
                  type="text"
                  value={newMember.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-default rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="멤버 이름"
                />
              </div>
              
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-secondary mb-1">직급</label>
                <select
                  id="position"
                  value={newMember.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  className="w-full px-3 py-2 border border-default rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Professor">Professor</option>
                  <option value="Ph.D Student">Ph.D Student</option>
                  <option value="M.S Student">M.S Student</option>
                  <option value="Undergraduate Student">Undergraduate Student</option>
                  <option value="Alumni">Alumni</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-secondary mb-1">이메일</label>
                <input
                  id="email"
                  type="email"
                  value={newMember.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-default rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="이메일 주소"
                />
              </div>
              
              <div>
                <label htmlFor="photo" className="block text-sm font-medium text-secondary mb-1">프로필 사진</label>
                <input
                  id="photo"
                  type="text"
                  value={newMember.photo}
                  onChange={(e) => handleInputChange('photo', e.target.value)}
                  className="w-full px-3 py-2 border border-default rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="사진 파일명 (예: member-name.png)"
                />
              </div>
              
              <div>
                <label htmlFor="homepage" className="block text-sm font-medium text-secondary mb-1">홈페이지</label>
                <input
                  id="homepage"
                  type="url"
                  value={newMember.homepage}
                  onChange={(e) => handleInputChange('homepage', e.target.value)}
                  className="w-full px-3 py-2 border border-default rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="홈페이지 URL"
                />
              </div>
              
              <div>
                <label htmlFor="googleScholar" className="block text-sm font-medium text-secondary mb-1">Google Scholar</label>
                <input
                  id="googleScholar"
                  type="url"
                  value={newMember.googleScholar}
                  onChange={(e) => handleInputChange('googleScholar', e.target.value)}
                  className="w-full px-3 py-2 border border-default rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Google Scholar URL"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label htmlFor="research_interests" className="block text-sm font-medium text-secondary mb-1">연구 관심사</label>
              <input
                id="research_interests"
                type="text"
                value={newMember.research_interests.join(", ")}
                onChange={(e) => handleInputChange('research_interests', e.target.value)}
                className="w-full px-3 py-2 border border-default rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="연구 관심사 (쉼표로 구분)"
              />
            </div>
            
            <div className="mt-6 flex gap-3">
              <button
                onClick={editingMember ? handleUpdateMember : handleAddMember}
                className="btn-primary"
              >
                {editingMember ? "수정" : "추가"}
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false)
                  setEditingMember(null)
                }}
                className="btn-secondary"
              >
                취소
              </button>
            </div>
          </div>
        )}

        {/* 멤버 목록 */}
        {activeTab === 'members' && (
          <div className="bg-surface border border-default rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-default">
              <h2 className="list-title">현재 멤버 목록</h2>
            </div>
            
            <div className="divide-y divide-default">
              {members.map((member) => (
                <div key={member.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-surface-subtle rounded-full flex items-center justify-center">
                      {member.photo ? (
                        <img 
                          src={`/images/members/${member.photo}`} 
                          alt={member.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-muted-subtle font-medium">
                          {member.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-primary">{member.name}</h3>
                      <p className="text-sm text-muted">{member.position}</p>
                      <p className="text-sm text-muted-subtle">{member.email}</p>
                      {member.research_interests && member.research_interests.length > 0 && (
                        <div className="mt-1">
                          <span className="text-xs text-muted-subtle">연구 관심사: </span>
                          <span className="text-xs text-muted">
                            {member.research_interests.join(", ")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditMember(member)}
                      className="text-accent hover:text-accent text-sm font-medium"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDeleteMember(member.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 출판물 목록 */}
        {activeTab === 'publications' && (
          <div className="bg-surface border border-default rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-default">
              <h2 className="list-title">출판물 목록</h2>
            </div>
            
            <div className="divide-y divide-default">
              {publications.map((publication) => (
                <div key={publication.id} className="px-6 py-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-primary mb-1">{publication.title}</h3>
                      <p className="text-sm text-muted mb-1">{publication.authors}</p>
                      <p className="text-sm text-muted-subtle mb-2">{publication.journal} ({publication.year})</p>
                      {publication.abstract && (
                        <p className="text-sm text-muted line-clamp-2">{publication.abstract}</p>
                      )}
                      <div className="mt-2 flex space-x-4">
                        {publication.doi && (
                          <a href={publication.doi} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent text-sm">
                            DOI
                          </a>
                        )}
                        {publication.paper && (
                          <a href={publication.paper} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent text-sm">
                            PDF
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button className="text-accent hover:text-accent text-sm font-medium">
                        수정
                      </button>
                      <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 강의 목록 */}
        {activeTab === 'lectures' && (
          <div className="bg-surface border border-default rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-default">
              <h2 className="list-title">강의 목록</h2>
            </div>
            
            <div className="divide-y divide-default">
              {lectures.map((lecture) => (
                <div key={lecture.id} className="px-6 py-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-primary mb-1">{lecture.title}</h3>
                      <p className="text-sm text-muted-subtle mb-2">{lecture.date}</p>
                      {lecture.description && (
                        <p className="text-sm text-muted">{lecture.description}</p>
                      )}
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button className="text-accent hover:text-accent text-sm font-medium">
                        수정
                      </button>
                      <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 프로젝트 목록 */}
        {activeTab === 'projects' && (
          <div className="bg-surface border border-default rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-default">
              <h2 className="list-title">프로젝트 목록</h2>
            </div>
            
            <div className="divide-y divide-default">
              {projects.map((project) => (
                <div key={project.id} className="px-6 py-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-start space-x-4">
                        {/* 프로젝트 이미지 */}
                        <div className="w-20 h-20 bg-surface-subtle rounded-lg flex-shrink-0 overflow-hidden">
                          {project.thumbnail ? (
                            <img 
                              src={project.thumbnail} 
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                          ) : project.image1 ? (
                            <img 
                              src={project.image1} 
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-subtle">
                              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        
                        {/* 프로젝트 정보 */}
                        <div className="flex-1">
                          <h3 className="font-medium text-primary mb-1">{project.title}</h3>
                          <p className="text-sm text-muted-subtle mb-2">{project.date}</p>
                          {project.description && (
                            <p className="text-sm text-muted mb-2 line-clamp-2">{project.description}</p>
                          )}
                          
                          {/* 프로젝트 참여자 */}
                          {project.people && project.people.length > 0 && (
                            <div className="mb-2">
                              <span className="text-xs text-muted-subtle">참여자: </span>
                              <span className="text-xs text-muted">
                                {project.people.map(person => person.name).join(", ")}
                              </span>
                            </div>
                          )}
                          
                          {/* 프로젝트 태그 */}
                          {project.tags && project.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {project.tags.map((tag, index) => (
                                <span key={index} className="btn-link-tag">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <button className="text-accent hover:text-accent text-sm font-medium">
                        수정
                      </button>
                      <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 안내 메시지 */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">개발 중인 기능</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>현재 멤버 추가/수정/삭제 기능은 개발 중입니다. 실제로는 다음 방법을 사용하세요:</p>
                <ul className="mt-2 list-disc list-inside space-y-1">
                  <li><strong>멤버 추가:</strong> <code>content/members/</code> 폴더에 새 MD 파일 생성</li>
                  <li><strong>멤버 수정:</strong> 기존 MD 파일의 frontmatter 편집</li>
                  <li><strong>멤버 삭제:</strong> 해당 MD 파일 삭제</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
              </div>
      </Layout>
  )
}

export default AdminPage

export const query = graphql`
  query {
    allMarkdownRemark(
      filter: { 
        fileAbsolutePath: { 
          regex: "/content/(members|publications|lectures|blog)/" 
        } 
      }
      sort: { frontmatter: { name: ASC } }
    ) {
      nodes {
        id
        fileAbsolutePath
        frontmatter {
          name
          position
          email
          photo
          homepage
          googleScholar
          research_interests
          title
          authors
          journal
          year
          doi
          paper
          abstract
          date
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

export const Head = () => <Seo title="Admin - HAI LAB" />
