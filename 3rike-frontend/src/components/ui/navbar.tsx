import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { X, Globe } from 'lucide-react';
import { Link as ScrollLink } from 'react-scroll';
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';
// import ComingSoonModal from "@/components/modal/coming-soon";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t, i18n } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [language, setLanguage] = useState<string>(i18n.language || "en");
  const [, setOpen] = useState(false);

  // Stable IDs (used for scroll)
  const sections = [
    { id: "home", label: t("sections.home") },
    { id: "services", label: t("sections.services") },
    { id: "about", label: t("sections.about") },
    { id: "faqs", label: t("sections.faqs") },
  ];
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setLanguage(code);
    setIsDropdownOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 lg:px-2 lg:pt-2 transition-all duration-300">
      {/* <div
        className={`mx-auto max-w-9xl flex h-12 sm:h-16 justify-between items-center
             px-3 sm:px-6 py-1
             bg-yellow-400 sm:bg-transparent
             lg:rounded-3xl transition-all duration-300
             ${scrolled
          ? "bg-[white]/30 shadow-md"
          : "bg-[white]"
          }`}
      > */}
      <div
        className={`mx-auto max-w-9xl flex h-16 sm:h-16 justify-between items-center px-3 sm:px-6 py-1 lg:rounded-3xl transition-all duration-300 ${scrolled
            ? "bg-yellow-400 lg:bg-[#8a8a8a] lg:backdrop-blur-lg lg:shadow-md"
            : "bg-yellow-400 lg:bg-transparent"
          }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 sm:space-x-3 min-w-0 shrink cursor-pointer">
          <img
            src="/logo.svg"
            alt="Logo"
            className="h-35 w-35 object-contain shrink-0 rounded-full"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6 text-base xl:text-lg text-white">
          {sections.map(({ id, label }) => (
            <ScrollLink
              key={id}
              to={id} // scrolls to <section id="home">...</section>
              smooth
              duration={500}
              offset={-50}
              className="cursor-pointer hover:text-[#FFD51B] transition whitespace-nowrap"
            >
              {label}
            </ScrollLink>
          ))}
        </nav>

        {/* Right Side */}
        <div className="hidden lg:flex items-center gap-3 xl:gap-4">
          {/* button */}
          <Button onClick={() => setOpen(true)} className='font-light text-black rounded-full bg-[white] hover:bg-[#b5b5b5]'>
            {t("sections.btn")}
          </Button>

          {/* Divider */}
          <div className="h-5 w-px bg-gray-300/60"></div>

          {/* Language Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="px-3 py-1.5 rounded-lg text-sm text-white font-medium hover:bg-[#b5b5b5] transition flex items-center gap-1.5"
            >
              <Globe className="w-4 h-4 text-white" />
              {language.toUpperCase()}
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg z-50 w-32">
                {[
                  { code: "en", label: "English" },
                  { code: "fr", label: "Français" },
                  { code: "es", label: "Español" },
                  // { code: "de", label: "Deutsch" },
                  // { code: "jp", label: "日本語" },
                  // { code: "cn", label: "中文" },
                  // { code: "he", label: "עברית" },
                  // { code: "ar", label: "العربية" }
                ].map((lng) => (
                  <button
                    key={lng.code}
                    onClick={() => changeLanguage(lng.code)}
                    className={`block w-full text-left px-3 py-2 text-xs text-gray-700 hover:text-gray-400 ${language === lng.code ? "bg-gray-100 font-medium" : ""
                      }`}
                  >
                    {lng.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="h-9 w-9"
          >
            {isOpen ? (
              <X className="text-black h-5 w-5" />
            ) : (
              <img src="burger.svg" alt="" className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className="
            lg:hidden top-0 left-0 w-full h-screen 
            bg-yellow-400 backdrop-blur-xl 
            z-50 
            flex flex-col items-center 
            py-4 -space-y-2
            overflow-y-auto
            relative
          "
        >
          {sections.map(({ id, label }) => (
            <ScrollLink
              key={id}
              to={id}
              smooth
              duration={500}
              offset={-50}
              onClick={() => setIsOpen(false)}
              className="cursor-pointer text-black  hover:text-[#b5b5b5] text-lg mt-10"
            >
              {label}
            </ScrollLink>
          ))}

          {/*  Buttons */}
          <div className="flex justify-center gap-4 pt-10 pb-10">
            {/* button */}
            <Button onClick={() => setOpen(true)} className='text-black font-light rounded-full bg-[white] hover:bg-[#b5b5b5]'>
              {t("sections.btn")}
            </Button>
          </div>

          {/* Language Selector */}
          <div className="relative mt-2">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="px-4 py-3 bg-white rounded-lg border  text-sm text-gray-800 flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              {language.toUpperCase()}
            </button>

            {isDropdownOpen && (
              <div className="absolute mt-2 left-1/2 -translate-x-1/2 bg-white border rounded-lg shadow-lg z-50 w-36 max-h-60 overflow-y-auto">
                {[
                  { code: "en", label: "English" },
                  { code: "fr", label: "Français" },
                  { code: "es", label: "Español" },
                  // { code: "de", label: "Deutsch" },
                  // { code: "jp", label: "日本語" },
                  // { code: "cn", label: "中文" },
                  // { code: "he", label: "עברית" },
                  // { code: "ar", label: "العربية" }
                ].map((lng) => (
                  <button
                    key={lng.code}
                    onClick={() => changeLanguage(lng.code)}
                    className={`block w-full text-left px-3 py-2 text-sm hover:bg-pink-50 ${language === lng.code ? "bg-pink-100 font-medium" : ""
                      }`}
                  >
                    {lng.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* <ComingSoonModal open={open} onClose={() => setOpen(false)} /> */}
    </div>
  );
}