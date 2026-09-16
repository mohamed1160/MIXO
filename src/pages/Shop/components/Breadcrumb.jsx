import { Link } from "react-router-dom";

export default function Breadcrumb() {
  return (
    <nav className="w-full text-center py-6 text-sm tracking-[0.1em] text-[#8C8C8C]">
      <Link
        to="/"
        className="hover:text-[#B08D57] transition-colors duration-300"
      >
        Home
      </Link>
      <span className="mx-2">/</span>
      <span className="text-[#2B2B2B]">Shop</span>
    </nav>
  );
}
