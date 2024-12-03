import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();
  
  return (
    <nav className="bg-gradient-to-br from-emerald-50/70 to-green-50/50 border-b border-emerald-100">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className={`text-lg font-medium transition-colors ${
                location.pathname === "/" ? "text-emerald-600" : "text-[#1a3c5b] hover:text-emerald-600"
              }`}
            >
              Home
            </Link>
            <Link
              to="/blog"
              className={`text-lg font-medium transition-colors ${
                location.pathname === "/blog" ? "text-emerald-600" : "text-[#1a3c5b] hover:text-emerald-600"
              }`}
            >
              Blog
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;