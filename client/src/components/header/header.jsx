import React, { useState, useEffect, useRef, useCallback } from 'react';
import './header.css';
import Logo from '../../assets/images/BUYGO_LOGO.png';
import { FaUser, FaShoppingCart, FaSearch } from 'react-icons/fa';
import { useUser } from '../../context/UserContext';
import { MdLightMode, MdDarkMode } from "react-icons/md";
import { BalanceDisplay } from './balance-display';
import socket from '../../services/socket';

const searchSuggestions = [
  "Steam Wallet 100$", "Google Play Gift Card", "PUBG Mobile UC", 
  "Xbox Game Pass", "Netflix Subscription", "Spotify Premium"
];

const Header = () => {
  const { user, updateBalance } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [cartCount, setCartCount] = useState(1);
  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);

  const searchRef = useRef(null);

  const handleUpdateUserBalance = useCallback(async ({ newBalance}) => {
            await updateBalance(newBalance);
  }, [updateBalance]);
  
    
    
      useEffect(() => {
        if (user?._id && socket) {
          socket.connect();
          socket.emit("join", user._id);
          socket.on("order_success", handleUpdateUserBalance);
          socket.on("markAsFailed", handleUpdateUserBalance);
    
          return () => {
            socket.off("order_success", handleUpdateUserBalance);
            socket.off("markAsFailed", handleUpdateUserBalance);
            socket.disconnect();
          };
        }
        }, [user?._id, handleUpdateUserBalance, socket]);
  useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth > 768) {
      setIsMobileSearchActive(false);
      document.body.style.overflow = 'auto'; // Reset scrolling
    }
  };

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

  useEffect(() => {
    if (searchTerm) {
      const matches = searchSuggestions.filter(item =>
        item.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSuggestions(matches);
      setShowDropdown(matches.length > 0);
    } else {
      setShowDropdown(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
        document.body.style.overflow = 'auto'
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Toggle bottom-header on mobile when search icon is clicked
  const handleSearchClick = () => {
    if (window.innerWidth <= 768) { // Mobile width
    setIsMobileSearchActive(prevState => {
      const newState = !prevState;
      document.body.style.overflow = newState ? 'hidden' : 'auto';
      return newState;
    });
  }
  };

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-theme");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-theme");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);


  return (
    <>
      <div className='top-header'>
        <div className='top-header-link-container'>
          <a className='top-header-link' href='/'>Hướng dẫn</a>
          <a className='top-header-link' href='/'>Tuyển dụng</a>
        </div>
        <div className='toggle-theme-mode-container'>
          {darkMode ? <MdDarkMode className='theme-icon' /> : <MdLightMode className='theme-icon'/>}
          <button className={`toggle-btn ${darkMode ? "active" : ""}`} onClick={() => setDarkMode(!darkMode)}>
          <div className="toggle-circle"></div>
        </button>
        </div>
      </div>
      <header className="header">     
        <div className="header-container">
          <div className="logo-container">
            <a href="/">
              <img src={Logo} alt="Logo" className="header-logo" />
            </a>
          </div>

          <nav className="nav-menu">
            <ul>
              <li><a href="/games">Trò chơi</a></li>
              <li><a href="/gift-cards">Gift Cards</a></li>
              <li><a href="/utilities">Tiện ích</a></li>
              <li><a href="/contact">Liên hệ</a></li>
            </ul>
          </nav>

          <div className="header-right">
            <div className="header-search" ref={searchRef}>
              <input
                type="text"
                placeholder="Tìm kiếm"
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowDropdown(true)}
              />
              <FaSearch className="header-search-icon" onClick={handleSearchClick} />
              
              {showDropdown && (
                <ul className="autocomplete-dropdown">
                  {filteredSuggestions.map((item, index) => (
                    <li key={index} onClick={() => setSearchTerm(item)}>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="header-icons">
              <div className="cart-container">
                <a href="/cart" className="icon">
                  <FaShoppingCart />
                  {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                </a>
              </div>
              {user ? (
                <div className="user-info">
                  <a href='/recharge' className="user-balance">
                    <BalanceDisplay/>
                    {/* <span className="balance">{user?.balance.toLocaleString() || 0}đ</span> */}
                  </a>
                  <a href='/account'><img src={user?.profileImg || "https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-512.png"} alt="User Avatar" className="user-avatar" /></a>
                </div>
              ) : (
                <div className="auth-links">
                  <a href="/login">Đăng nhập</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Bottom header that appears on mobile */}
      <div className={`bottom-header ${isMobileSearchActive ? 'show' : ''}`}>
        <div className="mobile-search-bar">
          <input
            type="text"
            placeholder="Tìm kiếm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mobile-search-input"
          />
        </div>
      </div>
    </>
  );
};

export default Header;
