import { useState } from "react";
import { Menu, X, Gamepad, User } from "lucide-react";
import { Link } from "react-router-dom";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full bg-black/50 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <Gamepad className="h-8 w-8 text-neon-emerald" />
          <span className="text-xl font-bold neon-text">ENZONIC</span>
        </Link>

        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            <li>
              <Link to="/" className="text-gray-300 hover:text-neon-emerald">
                Home
              </Link>
            </li>
            <li>
              <Link to="/games" className="text-gray-300 hover:text-neon-emerald">
                Games
              </Link>
            </li>
            <li>
              <Link to="/news" className="text-gray-300 hover:text-neon-emerald">
                News
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center space-x-4">
          <button className="hidden md:flex items-center space-x-2 rounded-full bg-neon-emerald/10 px-4 py-2 text-neon-emerald hover:bg-neon-emerald/20">
            <User className="h-5 w-5" />
            <span>Sign In</span>
          </button>

          <button
            className="md:hidden text-gray-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <nav className="glass-panel mx-4 my-2 p-4">
            <ul className="space-y-4">
              <li>
                <Link
                  to="/"
                  className="block text-gray-300 hover:text-neon-emerald"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/games"
                  className="block text-gray-300 hover:text-neon-emerald"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Games
                </Link>
              </li>
              <li>
                <Link
                  to="/news"
                  className="block text-gray-300 hover:text-neon-emerald"
                  onClick={() => setIsMenuOpen(false)}
                >
                  News
                </Link>
              </li>
              <li>
                <button className="flex w-full items-center space-x-2 rounded-full bg-neon-emerald/10 px-4 py-2 text-neon-emerald hover:bg-neon-emerald/20">
                  <User className="h-5 w-5" />
                  <span>Sign In</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};