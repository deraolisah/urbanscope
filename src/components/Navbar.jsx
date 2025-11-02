import React, { useState, useContext, useEffect, useRef } from 'react';
import logo from "../assets/logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RiCloseLargeLine } from "react-icons/ri";
import { RxHamburgerMenu } from "react-icons/rx";
import { AuthContext } from '../contexts/AuthContext';
import gsap from 'gsap';


const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  const navRef = useRef(null);
    useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    );
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      if (setFavorites) {
        setFavorites([]);
      }
      setIsMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav ref={navRef} className="w-full h-16 border-b border-dark/10 bg-white sticky top-0 z-50">
      <div className='container h-full flex items-center justify-between relative bg-light z-2'>
        <Link to="/" onClick={() => { window.scrollTo(0,0); closeMenu(); windows.reload(); }} className="text-base font-extrabold uppercase flex items-center gap-2"> 
          <img src={logo} alt='UrbanScope Logo' className='h-8' />
        </Link>

        <ul className='hidden md:flex items-center space-x-8'>
          <Link to="/" onClick={() => { window.scrollTo(0,0); windows.reload(); }} className={`relative text-dark/80 hover:text-dark transition-colors after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-dark after:transition-all after:duration-300 hover:after:w-full ${ location.pathname === '/' ? 'text-dark font-semibold after:w-full' : '' }`}>
            Home
          </Link>
          <Link to="/explore" onClick={() => { window.scrollTo(0,0); windows.reload(); }} className={`relative text-dark/80 hover:text-dark transition-colors after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-dark after:transition-all after:duration-300 hover:after:w-full ${location.pathname === '/explore' ? 'text-dark font-semibold after:w-full' : ''}`}> Explore </Link>
          <Link to="/about" className={`relative text-dark/80 hover:text-dark transition-colors after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-dark after:transition-all after:duration-300 hover:after:w-full ${location.pathname === '/about' ? 'text-dark font-semibold after:w-full' : ''}`}> About </Link>
          <Link to="/contact" className={`relative text-dark/80 hover:text-dark transition-colors after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-dark after:transition-all after:duration-300 hover:after:w-full ${location.pathname === '/contact' ? 'text-dark font-semibold after:w-full' : ''}`}> Contact </Link>
          <Link to="/services" className={`relative text-dark/80 hover:text-dark transition-colors after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-dark after:transition-all after:duration-300 hover:after:w-full ${location.pathname === '/services' ? 'text-dark font-semibold after:w-full' : ''}`}> Services </Link>
          
          {/* Conditional rendering based on if user is logged in */}
          {user ? (
            <div className="flex items-center gap-4">
              <Link 
                to={user.role === 'admin' ? '/admin' : '/dashboard'} 
                className="btn text-nowrap truncate"
              >
                {user.role === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}
              </Link>
            </div>
          ) : (
            <Link to="/login" className="btn" onClick={() => { scrollTo(0,0) }}> Sign In </Link>
          )}
        </ul>

        {/* Mobile menu button */}
        <button className="md:hidden text-2xl cursor-pointer" onClick={() => setIsMenuOpen(prev => !prev)}>
          {isMenuOpen ? <RiCloseLargeLine /> : <RxHamburgerMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <ul className={`z-2 relative w-full h-screen overflow-y-auto md:hidden flex flex-col items-start space-y-4 p-4 pb-6 bg-white border-t border-gray-200 transition-all duration-400 ${isMenuOpen ? "translate-y-0 pointer-events-auto" : "-translate-y-20 opacity-0 pointer-events-none" }`}>
        <Link to="/" onClick={closeMenu} className="text-dark hover:text-dark/60 w-full"> Home </Link>
        <Link to="/explore" onClick={closeMenu} className="text-dark hover:text-dark/60 w-full"> Explore </Link>
        <Link to="/about" onClick={closeMenu} className="text-dark hover:text-dark/60 w-full"> About </Link>
        <Link to="/contact" onClick={closeMenu} className="text-dark hover:text-dark/60 w-full"> Contact </Link>
        <Link to="/services" onClick={closeMenu} className="text-dark hover:text-dark/60 w-full"> Services </Link>
        
        {/* Conditional mobile menu based on auth */}
        {user ? (
          <>
            <div className="w-full pt-2 border-t border-gray-200">
              <p className="text-dark/80 mb-2">Welcome, {user.username}!</p>
              <Link 
                to={user.role === 'admin' ? '/admin' : '/user'} 
                onClick={closeMenu}
                className="block w-full text-center btn mb-2 text-nowrap truncate"
              >
                {user.role === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}
              </Link>
              <button 
                onClick={() => {
                  handleLogout();
                  closeMenu();
                }}
                className="block w-full text-center btn-tertiary"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <Link to="/login" onClick={closeMenu} className="btn w-full text-center"> Sign In </Link>
        )}
      </ul>

      {/* Mobile menu overlay */}
      {/* {isMenuOpen && ( 
        <div onClick={closeMenu} className='w-full h-full fixed inset-0 z-1 top-0 left-0 bottom-0 bg-dark/80 backdrop-blur-xs cursor-pointer'></div>
      )}  */}
    </nav>
  )
}

export default Navbar;