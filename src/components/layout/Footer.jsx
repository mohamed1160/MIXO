import { Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";
import footerBg from "../../assets/images/footer_bg.png";
import scarabIcon from "../../assets/images/scarab_icon.png";

const Instagram = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Facebook = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TikTok = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const Youtube = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2.5 7.1C2.5 7.1 2 9.5 2 12c0 2.5.5 4.9.5 4.9S3.8 19 6.4 19.3c1.7.2 5.6.2 5.6.2s3.9 0 5.6-.2c2.6-.3 3.9-2.4 3.9-2.4s.5-2.4.5-4.9c0-2.5-.5-4.9-.5-4.9S20.2 5 17.6 4.7C15.9 4.5 12 4.5 12 4.5s-3.9 0-5.6.2C3.8 5 2.5 7.1 2.5 7.1z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
  </svg>
);

const shopLinks = [
  { label: "All Products", path: "/shop" },
  { label: "New Arrivals", path: "/collections/new-arrivals" },
  { label: "Best Sellers", path: "/collections/best-sellers" },
  { label: "T-Shirts", path: "/category/t-shirts" },
  { label: "Hoodies", path: "/category/hoodies" },
  { label: "Accessories", path: "/category/accessories" },
  { label: "Limited Edition", path: "/collections/limited" },
];

const collectionsLinks = [
  { label: "Overview", path: "/collections" },
  { label: "T-Shirts", path: "/category/t-shirts" },
  { label: "Hoodies", path: "/category/hoodies" },
  { label: "Accessories", path: "/category/accessories" },
  { label: "Limited Edition", path: "/collections/limited" },
  { label: "Stone Drop", path: "/collections/stone-drop" },
  { label: "Signature Collection", path: "/collections/signature" },
];

const companyLinks = [
  { label: "Our Story", path: "/our-story" },
  { label: "Journal", path: "/journal" },
  { label: "Careers", path: "/careers" },
  { label: "Privacy Policy", path: "/privacy-policy" },
  { label: "Terms & Conditions", path: "/terms" },
];

const supportLinks = [
  { label: "Contact", path: "/contact" },
  { label: "FAQ", path: "/faq" },
  { label: "Shipping", path: "/shipping" },
  { label: "Returns", path: "/returns" },
];

const socialLinks = [
  { icon: Instagram, url: "https://instagram.com", label: "Instagram" },
  { icon: Facebook, url: "https://facebook.com", label: "Facebook" },
  { icon: TikTok, url: "https://tiktok.com", label: "TikTok" },
  { icon: Youtube, url: "https://youtube.com", label: "YouTube" },
];

// Reusable Column Component
const FooterColumn = ({ title, links }) => (
  <div className="flex flex-col items-center md:items-start text-center md:text-left">
    <h3 className="text-[#B88932] font-serif text-lg tracking-widest uppercase mb-4 drop-shadow-md">
      {title}
    </h3>
    <ul className="flex flex-col gap-2">
      {links.map((link, idx) => (
        <li key={idx}>
          <Link
            to={link.path}
            className="text-[#D1C6B4] font-medium tracking-wide text-xs transition-all duration-300 inline-block hover:text-[#B88932] hover:-translate-y-[2px]"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative w-full bg-[#0D0A06] bg-cover bg-bottom border-t border-[#B88932]/20 pt-10 pb-4 overflow-hidden mt-0"
      style={{ backgroundImage: `url(${footerBg})` }}
    >
      {/* Dark overlay for readability over the textured bg */}
      <div className="absolute inset-0 bg-[#0A0704]/80 backdrop-blur-[1px]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6 mb-8 mt-2">
          {/* Column 1: Brand / Logo / Socials / Contact */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left lg:col-span-1">
            <Link
              to="/"
              className="mb-4 flex flex-col items-center md:items-start group"
            >
              <img
                src={scarabIcon}
                alt="MIXO Logo"
                className="w-10 h-10 object-contain mb-2 drop-shadow-[0_0_8px_rgba(184,137,50,0.5)] group-hover:drop-shadow-[0_0_12px_rgba(184,137,50,0.8)] transition-all duration-300"
              />
              <h2 className="text-2xl font-serif text-[#B88932] tracking-[0.2em] uppercase">
                MIXO
              </h2>
            </Link>

            <p className="text-[#D1C6B4] text-xs leading-relaxed mb-6 max-w-xs">
              We don't follow trends. We wear legacy. Handcrafted premium
              apparel for the modern pharaoh.
            </p>

            <div className="flex flex-col gap-3 mb-6">
              <a
                href="mailto:support@MIXO.com"
                className="flex items-center justify-center md:justify-start gap-3 text-[#D1C6B4] hover:text-[#B88932] transition-colors duration-300 text-xs group"
              >
                <Mail className="w-4 h-4 text-[#B88932] group-hover:scale-110 transition-transform" />
                support@MIXO.com
              </a>
              <a
                href="tel:+201234567890"
                className="flex items-center justify-center md:justify-start gap-3 text-[#D1C6B4] hover:text-[#B88932] transition-colors duration-300 text-xs group"
              >
                <Phone className="w-4 h-4 text-[#B88932] group-hover:scale-110 transition-transform" />
                +20 123 456 7890
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-8 h-8 rounded-full border border-[#B88932]/30 flex items-center justify-center text-[#B88932] transition-all duration-300 hover:border-[#B88932] hover:bg-[#B88932]/10 hover:shadow-[0_0_15px_rgba(184,137,50,0.4)] hover:scale-110"
                >
                  <social.icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Columns 2-5: Navigation Links */}
          <FooterColumn title="Shop" links={shopLinks} />
          <FooterColumn title="Collections" links={collectionsLinks} />
          <FooterColumn title="Company" links={companyLinks} />
          <FooterColumn title="Support" links={supportLinks} />
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#B88932]/20 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center">
          <p className="text-[#D1C6B4]/60 text-xs tracking-wide">
            &copy; {currentYear} MIXO. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-6 h-[1px] bg-[#B88932] opacity-40"></div>
            <img
              src={scarabIcon}
              alt="Scarab"
              className="w-5 h-5 object-contain opacity-50"
            />
            <div className="w-6 h-[1px] bg-[#B88932] opacity-40"></div>
          </div>
          <p className="text-[#D1C6B4]/60 text-xs tracking-wide">
            Designed for Legacy
          </p>
        </div>
      </div>
    </footer>
  );
}

