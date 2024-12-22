import { useState } from "react";
import { Menu, X, Gamepad2, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { session } = useSessionContext();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleSignIn = () => {
    navigate("/auth");
  };

  return (
    <header className="fixed top-0 z-50 w-full backdrop-blur-xl bg-gradient-to-r from-black/80 to-gray-900/80 shadow-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="group flex items-center space-x-2">
          <Gamepad2 className="h-8 w-8 text-neon-emerald transition-transform duration-300 group-hover:rotate-12" />
          <span className="text-2xl font-bold bg-gradient-to-r from-neon-emerald to-neon-cyan bg-clip-text text-transparent transition-all duration-300 group-hover:tracking-wider">
            ENZONIC GAMES
          </span>
        </Link>

        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            <li>
              <Link 
                to="/" 
                className="relative text-gray-300 transition-colors duration-300 hover:text-neon-emerald after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-neon-emerald after:transition-all after:duration-300 hover:after:w-full"
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/games" 
                className="relative text-gray-300 transition-colors duration-300 hover:text-neon-emerald after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-neon-emerald after:transition-all after:duration-300 hover:after:w-full"
              >
                Games
              </Link>
            </li>
            <li>
              <Link 
                to="/news" 
                className="relative text-gray-300 transition-colors duration-300 hover:text-neon-emerald after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-neon-emerald after:transition-all after:duration-300 hover:after:w-full"
              >
                News
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center space-x-4">
          {session ? (
            <button
              onClick={handleSignOut}
              className="hidden md:flex items-center space-x-2 rounded-full bg-gradient-to-r from-neon-emerald/10 to-neon-cyan/10 px-4 py-2 text-neon-emerald transition-all duration-300 hover:from-neon-emerald/20 hover:to-neon-cyan/20 hover:shadow-lg hover:shadow-neon-emerald/20"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          ) : (
            <button
              onClick={handleSignIn}
              className="hidden md:flex items-center space-x-2 rounded-full bg-gradient-to-r from-neon-emerald/10 to-neon-cyan/10 px-4 py-2 text-neon-emerald transition-all duration-300 hover:from-neon-emerald/20 hover:to-neon-cyan/20 hover:shadow-lg hover:shadow-neon-emerald/20"
            >
              <User className="h-5 w-5" />
              <span>Sign In</span>
            </button>
          )}

          <button
            className="md:hidden text-gray-300 transition-colors duration-300 hover:text-neon-emerald"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <nav className="glass-panel mx-4 my-2 p-4 animate-in slide-in-from-top duration-300">
            <ul className="space-y-4">
              <li>
                <Link
                  to="/"
                  className="block text-gray-300 transition-colors duration-300 hover:text-neon-emerald"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/games"
                  className="block text-gray-300 transition-colors duration-300 hover:text-neon-emerald"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Games
                </Link>
              </li>
              <li>
                <Link
                  to="/news"
                  className="block text-gray-300 transition-colors duration-300 hover:text-neon-emerald"
                  onClick={() => setIsMenuOpen(false)}
                >
                  News
                </Link>
              </li>
              <li>
                {session ? (
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="flex w-full items-center space-x-2 rounded-full bg-gradient-to-r from-neon-emerald/10 to-neon-cyan/10 px-4 py-2 text-neon-emerald transition-all duration-300 hover:from-neon-emerald/20 hover:to-neon-cyan/20"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleSignIn();
                      setIsMenuOpen(false);
                    }}
                    className="flex w-full items-center space-x-2 rounded-full bg-gradient-to-r from-neon-emerald/10 to-neon-cyan/10 px-4 py-2 text-neon-emerald transition-all duration-300 hover:from-neon-emerald/20 hover:to-neon-cyan/20"
                  >
                    <User className="h-5 w-5" />
                    <span>Sign In</span>
                  </button>
                )}
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};