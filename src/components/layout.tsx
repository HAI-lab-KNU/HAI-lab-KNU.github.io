import * as React from "react";
import { graphql, useStaticQuery, Link } from "gatsby";
import { ReactNode, useEffect, useState } from "react";
import { initFlowbite } from "flowbite";
import { FaGithub } from "react-icons/fa6";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { SiResearchgate, SiGooglescholar } from "react-icons/si";
import { HiMenu, HiX, HiOutlineMoon, HiOutlineSun } from "react-icons/hi";


type LayoutProps = {
  activeLink?: string;
  children: ReactNode;
};

const MENU = {
  Home: "/",
  People: "/members",
  Projects: "/blog",
  Publications: "/publications",
  Lectures: "/lectures",
  // Contact: "/contact", // Hidden for now
  // News: "/news", // Hidden for now, will be developed later
};

const Layout = ({ activeLink = "Projects", children }: LayoutProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    initFlowbite();
  }, []);

  useEffect(() => {
    const dark = document.documentElement.classList.contains("dark");
    setIsDark(dark);
  }, []);

  const toggleDark = () => {
    const next = !document.documentElement.classList.toggle("dark");
    setIsDark(!next);
    try {
      localStorage.setItem("theme", next ? "light" : "dark");
    } catch (_) {}
  };

  const { site } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <div className="min-h-screen bg-page transition-colors duration-300">
              {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-page/95 backdrop-blur-sm transition-all duration-300" role="navigation" aria-label="Main navigation">
          <div className="w-full max-w-7xl mx-auto flex justify-between items-center px-4 md:px-12 py-3 md:py-5">
            <Link to="/" className="flex items-center mr-6 md:mr-12 focus:outline-none rounded">
              <img 
                src="/images/logo-hai-crop.png" 
                alt="HAI Lab Logo" 
                className="h-6 md:h-8 w-auto mr-2"
              />
              <span className="text-sm md:text-base font-light text-primary hover:text-accent transition-colors duration-300 whitespace-nowrap overflow-hidden">
                Human-AI Interaction Lab.
              </span>
            </Link>
            
            {/* 데스크톱 메뉴 - 1280px 이상에서만 풀 메뉴 표시 */}
            <div className="hidden xl:flex items-center space-x-4" role="menubar">
              {Object.entries(MENU).map(([name, path]) => (
                <Link
                  key={name}
                  to={path}
                  className={`px-6 py-3 rounded-lg text-lg font-light focus:outline-none transition-colors duration-300 ${
                    activeLink.toLowerCase() === name.toLowerCase()
                      ? "text-accent"
                      : "text-muted hover:text-accent"
                  }`}
                  role="menuitem"
                  aria-current={activeLink.toLowerCase() === name.toLowerCase() ? "page" : undefined}
                >
                  {name}
                </Link>
              ))}
              {/* 다크모드 토글: 데스크톱에서만 Lectures 옆에 1개 */}
              <button
                type="button"
                onClick={toggleDark}
                className="p-2.5 rounded-lg text-muted hover:text-primary hover:bg-surface-subtle transition-colors duration-200"
                aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
              >
                {isDark ? (
                  <HiOutlineSun className="w-5 h-5" />
                ) : (
                  <HiOutlineMoon className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* 1280px 미만: 햄버거만 표시 */}
            <div className="flex xl:hidden items-center gap-1">
              <button
              className="p-2 rounded-lg text-muted hover:bg-surface-subtle hover:text-primary transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <HiX className="w-6 h-6" />
              ) : (
                <HiMenu className="w-6 h-6" />
              )}
            </button>
            </div>
          </div>

          {/* 모바일/태블릿 펼침 메뉴 (xl 미만에서만) */}
          <div 
            className={`xl:hidden bg-white/95 dark:bg-page/95 backdrop-blur-sm overflow-hidden transition-all duration-300 ease-in-out ${
              isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="px-4 md:px-6 py-3 md:py-4 space-y-1 md:space-y-2">
              {Object.entries(MENU).map(([name, path]) => (
                <Link
                  key={name}
                  to={path}
                  className={`block px-3 md:px-4 py-2 md:py-3 rounded-lg text-base font-light transition-colors duration-300 ${
                    activeLink.toLowerCase() === name.toLowerCase()
                      ? "text-accent bg-accent-muted"
                      : "text-muted hover:text-accent"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                  role="menuitem"
                  aria-current={activeLink.toLowerCase() === name.toLowerCase() ? "page" : undefined}
                >
                  {name}
                </Link>
              ))}
              {/* 모바일: 메뉴 안에서 다크모드 토글 */}
              <button
                type="button"
                onClick={() => { toggleDark(); setIsMenuOpen(false); }}
                className="w-full text-left px-3 md:px-4 py-2 md:py-3 rounded-lg text-base font-light text-muted hover:text-accent hover:bg-surface-subtle transition-colors duration-300 flex items-center gap-2"
                aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
              >
                {isDark ? <HiOutlineSun className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
                <span>{isDark ? "라이트 모드" : "다크 모드"}</span>
              </button>
            </div>
          </div>
        </nav>

              {/* Content */}
        <main 
          className="w-full max-w-7xl mx-auto px-3 md:px-8 pb-16 pt-20 md:pt-24 text-primary" 
          id="main-content" 
          role="main"
        >
          {children}
        </main>

      {/* Footer */}
      <footer className="bg-surface py-6 mt-auto border-t border-default transition-colors duration-300">
        <div className="w-full max-w-7xl mx-auto px-3 md:px-8">
          <div className="flex justify-between items-center">
            <div className="text-xs md:text-sm text-muted-subtle">
              <div className="max-w-2xl">
                <div className="text-xs text-muted-subtle whitespace-pre-line mb-1 md:mb-2">
                  Kangwon National University College of Engineering 6, Room 512<br />
                  1, Gangwondaehakgil, Chuncheon-si, Gangwon-do (24341)
                </div>
                <span className="block text-xs text-muted-subtle">© 2025 Human-AI Interaction Lab</span>
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <img
                src="/images/knu-logo.webp"
                alt="Kangwon National University Logo"
                className="h-8 md:h-12 w-auto opacity-80 hover:opacity-100 transition-opacity duration-200"
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;