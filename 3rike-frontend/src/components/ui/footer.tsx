import { useTranslation } from "react-i18next";
import { FaTelegram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";


export default function Footer() {
    const { t } = useTranslation();
    return (
        <footer className="bg-yellow-400 text-[#667185] pb-6 px-6 md:px-12 relative overflow-hidden">
            {/* Footer Container */}
            <div className="
        relative 
        py-16 
        w-full mx-auto 
        grid grid-cols-1 
        lg:grid-cols-2 
        gap-10 md:gap-16 lg:gap-32 
        items-start
    ">

                {/* Watermark */}


                {/* Brand + Legal */}
                <div className="relative z-10 space-y-4">
                    <div className="flex items-center space-x-2">
                        <img
                            src="/logo.svg"
                            alt="3rike logo"
                            className="h-35 w-35 object-contain"
                        />
                    </div>

                    <ul className="flex flex-row space-x-6 text-gray-600 text-sm">
                        <li>
                            <a href="/privacy-policy" className="hover:text-black transition">
                                {t("footer.policy")}
                            </a>
                        </li>
                        <li>
                            <a href="/terms" className="hover:text-black transition">
                                {t("footer.terms")}
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Socials */}
                <div className="relative z-10 flex flex-wrap gap-3 lg:justify-end">
                    <a
                        href="https://x.com/3rikeBot_"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                    >
                        <FaXTwitter />
                    </a>

                    <a
                        href="https://t.me/3riketrading"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                    >
                        <FaTelegram />
                    </a>

                    {/*<a
                        href="#"
                        className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                    >
                        <FaLinkedinIn />
                    </a>
                    <a
                        href="#"
                        className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                    >
                        <FaInstagram />
                    </a>
                    <a
                        href="#"
                        className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                    >
                        <FaTiktok />
                    </a> */}
                </div>


            </div>

            {/* Bottom Bar */}
            <div className="
      max-w-7xl mx-auto 
      border-t border-gray-200 
      mt-12 pt-6 
      flex flex-col md:flex-row 
      justify-center 
      items-center 
      text-sm text-gray-600 
      gap-4 
      relative z-10
  ">
                <p>
                    © {new Date().getFullYear()} {t("footer.company")}. {t("footer.rights")}
                </p>
            </div>
        </footer>

    );
}
