import { useState } from "react";
import { Menu, X, Gamepad, User, LogOut } from "lucide-react";
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
          {session ? (
            <button
              onClick={handleSignOut}
              className="hidden md:flex items-center space-x-2 rounded-full bg-neon-emerald/10 px-4 py-2 text-neon-emerald hover:bg-neon-emerald/20"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          ) : (
            <button
              onClick={handleSignIn}
              className="hidden md:flex items-center space-x-2 rounded-full bg-neon-emerald/10 px-4 py-2 text-neon-emerald hover:bg-neon-emerald/20"
            >
              <User className="h-5 w-5" />
              <span>Sign In</span>
            </button>
          )}

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
                {session ? (
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="flex w-full items-center space-x-2 rounded-full bg-neon-emerald/10 px-4 py-2 text-neon-emerald hover:bg-neon-emerald/20"
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
                    className="flex w-full items-center space-x-2 rounded-full bg-neon-emerald/10 px-4 py-2 text-neon-emerald hover:bg-neon-emerald/20"
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