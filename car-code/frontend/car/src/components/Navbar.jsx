import { useState, useEffect } from 'react';
import { Settings, LogOut, UserCircle, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/auth/me', {
          withCredentials: true,
        });
        setIsAuthenticated(true);
        setUser(response.data.user);
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
      }
    };
    verifyToken();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:4000/api/auth/logout', {}, { withCredentials: true });
      setIsAuthenticated(false);
      setUser(null);
      setIsMobileMenuOpen(false);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-[#081840] shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2 space-x-reverse">
          <Settings className="h-6 w-6 text-[#FCDE59]" />
          <span className="text-xl font-bold text-white">أوتو دياج</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 space-x-reverse">
          <Link to="/" className="text-white hover:text-[#FCDE59] font-medium transition duration-300">
            الرئيسية
          </Link>
          <Link to="/diagnose" className="text-white hover:text-[#FCDE59] font-medium transition duration-300">
            تشخيص الأعطال
          </Link>
          <Link to="/spare-parts" className="text-white hover:text-[#FCDE59] font-medium transition duration-300">
            متجر قطع الغيار
          </Link>
          <Link to="/booking" className="text-white hover:text-[#FCDE59] font-medium transition duration-300">
            الميكانيكيون
          </Link>
          <Link to="/blog" className="text-white mx-4 hover:text-[#FCDE59] font-medium transition duration-300">
            المقالات
          </Link>
          {isAuthenticated && user?.role === 'mechanic' && (
            <Link to="/mechanic" className="text-white hover:text-[#FCDE59] font-medium transition duration-300">
              لوحة التحكم
            </Link>
          )}
          {isAuthenticated && user?.role === 'admin' && (
            <Link to="/admin" className="text-white hover:text-[#FCDE59] font-medium transition duration-300">
              لوحة الإدارة
            </Link>
          )}
        </div>

        {/* Desktop Auth Section */}
        <div className="hidden md:flex items-center space-x-4 space-x-reverse">
          {isAuthenticated ? (
            <>
              <div className="flex items-center space-x-2 space-x-reverse">
                <span className="text-white font-medium">{user?.name}</span>
                {user?.role === 'user' && (
                  <Link to="/profile" className="text-white hover:text-[#FCDE59] transition duration-300">
                    <UserCircle className="h-5 w-5" />
                  </Link>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center bg-transparent hover:bg-[#5D1D5F]/20 text-white font-medium py-2 px-4 border border-[#FCDE59] rounded transition duration-300"
              >
                <LogOut className="h-5 w-5 ml-2" />
                تسجيل الخروج
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-transparent hover:bg-[#5D1D5F]/20 text-white font-medium py-2 px-4 border border-[#FCDE59] rounded transition duration-300"
              >
                تسجيل الدخول
              </Link>
              <Link
                to="/register"
                className="bg-[#5D1D5F] hover:bg-[#5D1D5F]/80 text-white font-medium py-2 px-4 rounded transition duration-300"
              >
                إنشاء حساب
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-white hover:text-[#FCDE59] focus:outline-none">
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#081840] px-4 py-2">
          <div className="flex flex-col space-y-2 text-right">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white hover:text-[#FCDE59] font-medium py-2 transition duration-300"
            >
              الرئيسية
            </Link>
            <Link
              to="/diagnose"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white hover:text-[#FCDE59] font-medium py-2 transition duration-300"
            >
              تشخيص الأعطال
            </Link>
            <Link
              to="/spare-parts"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white hover:text-[#FCDE59] font-medium py-2 transition duration-300"
            >
              متجر قطع الغيار
            </Link>
            <Link
              to="/mechanics"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white hover:text-[#FCDE59] font-medium py-2 transition duration-300"
            >
              الميكانيكيون
            </Link>
            <Link
              to="/blog"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white hover:text-[#FCDE59] font-medium py-2 transition duration-300"
            >
              المقالات
            </Link>
            {isAuthenticated && user?.role === 'mechanic' && (
              <Link
                to="/mechanic"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white hover:text-[#FCDE59] font-medium py-2 transition duration-300"
              >
                لوحة التحكم
              </Link>
            )}
            {isAuthenticated && user?.role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white hover:text-[#FCDE59] font-medium py-2 transition duration-300"
              >
                لوحة الإدارة
              </Link>
            )}
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2 space-x-reverse py-2">
                  
                  {user?.role === 'user' && (
                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-white hover:text-[#FCDE59] transition duration-300"
                    >
                      <span className="text-white font-medium">{user?.name}</span>
                      <UserCircle className="h-5 w-5" />
                    </Link>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-end text-white hover:text-[#FCDE59] font-medium py-2 transition duration-300"
                >
                  <LogOut className="h-5 w-5 ml-2" />
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white hover:text-[#FCDE59] font-medium py-2 transition duration-300"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white hover:text-[#FCDE59] font-medium py-2 transition duration-300"
                >
                  إنشاء حساب
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}