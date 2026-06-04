import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#F5F5F0] px-6 md:px-[78px] pt-1 md:pt-16 pb-8 md:pb-10">
      {/* Top section */}
      <div className="flex flex-col sm:flex-row justify-between items-center md:gap-6 mb-6 md:mb-8">
        {/* Logo */}
        
        <img
          src="/new_3rike_logo.png"
          alt="3riKE Logo"
          className={`h-24 md:h-20 w-auto object-contain`}
        />

        {/* Social icons */}
        <div className="flex items-center md:gap-3 gap-4.5">
          <a
            href="#"
            className="md:w-8 md:h-8 w-10 h-10 rounded-full bg-[#3b5998] flex items-center justify-center text-white hover:opacity-80 transition"
          >
            <FaFacebookF size={16} />
          </a>
          <a
            href="https://x.com/3rike_"
            target="_blank"
            rel="noopener noreferrer"
            className="md:w-8 md:h-8 w-10 h-10 rounded-full bg-[#1DA1F2] flex items-center justify-center text-white hover:opacity-80 transition"
          >
            <FaTwitter size={16} />
          </a>
          <a
            href="https://www.instagram.com/3rike.ng/"
            className="md:w-8 md:h-8 w-10 h-10 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center text-white hover:opacity-80 transition"
          >
            <FaInstagram size={16} />
          </a>
          <a
            href="https://www.linkedin.com/company/3rike/"
            className="md:w-8 md:h-8 w-10 h-10 rounded-full bg-[#0077b5] flex items-center justify-center text-white hover:opacity-80 transition"
          >
            <FaLinkedinIn size={16} />
          </a>
        </div>
      </div>

      {/* Links */}
      <div className="flex items-center justify-center md:items-start md:justify-start gap-6 md:gap-8 text-[#829E04] text-sm mb-5 md:mb-12">
        <a href="/terms" className="hover:underline transition">
          Terms of Service
        </a>
        <a href="/privacy-policy" className="hover:underline transition">
          Privacy Policy
        </a>
      </div>

      {/* Divider */}
      <div className="border-t border-[#D9D9D9] mb-4 md:mb-8" />

      {/* Copyright */}
      <p className="text-center text-[#999999] text-sm">
        © All {new Date().getFullYear()} copyright all rights reserved.
      </p>
    </footer>
  );
}
