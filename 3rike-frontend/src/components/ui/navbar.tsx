import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "FAQs", href: "#faqs" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const scrollTo = (href: string) => {
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsOpen(false);
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 px-4 lg:px-[78px] pt-4">
        <div
          className={`mx-auto flex h-20 justify-between items-center px-6 lg:px-10 rounded-2xl border border-[#E2F490] transition-all duration-300 ${
            scrolled
              ? "bg-white/50 backdrop-blur-md shadow-sm"
              : "bg-[#F5F5F0]"
          }`}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0 cursor-pointer">
            <img
              src="/new_3rike_logo.png"
              alt="3riKE Logo"
              className="h-16 w-auto object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-12">
            {navLinks.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(href);
                }}
                className="text-[#1A1A1A] text-lg font-medium hover:text-[#829E04] transition-colors cursor-pointer"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Contact Button — Desktop */}
          <div className="hidden lg:block">
            <button
              type="button"
              className="bg-[#829E04] text-white text-lg font-medium px-8 py-3 cursor-pointer hover:bg-[#6f8703] transition-colors"
            >
              Contact us
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden h-10 w-10 flex items-center justify-center cursor-pointer"
          >
            {isOpen ? (
              <X className="text-black h-6 w-6" />
            ) : (
              <img src="burger.svg" alt="Menu" className="w-7 h-7" />
            )}
          </button>
        </div>
      </div>

      {/* Full-screen Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-[#F5F5F0] flex flex-col transition-all duration-500 ease-in-out lg:hidden ${
          isOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible"
        }`}
      >
        {/* Spacer for navbar */}
        <div className="h-28" />

        {/* Nav Links */}
        <div className="flex-1 flex flex-col items-center justify-center gap-2 px-8">
          {navLinks.map(({ label, href }, index) => (
            <button
              key={href}
              type="button"
              onClick={() => scrollTo(href)}
              className="text-[#1A1A1A] text-4xl font-bold hover:text-[#829E04] transition-all duration-300 cursor-pointer py-4"
              style={{
                transitionDelay: isOpen ? `${index * 100 + 100}ms` : '0ms',
                transform: isOpen ? 'translateY(0)' : 'translateY(30px)',
                opacity: isOpen ? 1 : 0,
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Bottom CTA */}
        <div
          className="px-8 pb-12"
          style={{
            transitionDelay: isOpen ? '400ms' : '0ms',
            transform: isOpen ? 'translateY(0)' : 'translateY(20px)',
            opacity: isOpen ? 1 : 0,
            transition: 'all 0.4s ease-out',
          }}
        >
          <button
            type="button"
            className="bg-[#829E04] text-white text-xl font-medium py-5 w-full cursor-pointer hover:bg-[#6f8703] transition-colors rounded-xl"
          >
            Contact us
          </button>
        </div>
      </div>
    </>
  );
}
