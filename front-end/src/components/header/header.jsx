import React, { useState, useEffect, useRef } from 'react';
import './header.css';
import Logo from '../../assets/images/BUYGO1.png';
import { FaUser, FaShoppingCart, FaSearch } from 'react-icons/fa';
import { useUser } from '../../context/UserContext';

const searchSuggestions = [
  "Steam Wallet 100$", "Google Play Gift Card", "PUBG Mobile UC", 
  "Xbox Game Pass", "Netflix Subscription", "Spotify Premium"
];

const Header = () => {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const searchRef = useRef(null);

  useEffect(() => {
    console.log(user);
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
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className='top-header'>
        <a className='top-header-link' href='/'>Hướng dẫn</a>
        <a className='top-header-link' href='/'>Tuyển dụng</a>
      </div>
      <header className="header">     
        <div className="header-container">
          {/* Logo */}
          <div className="logo-container">
            <a href="/">
              <img src={Logo} alt="Logo" className="header-logo" />
            </a>
          </div>

          {/* Navigation Menu */}
          <nav className="nav-menu">
            <ul>
              <li><a href="/games">Trò chơi</a></li>
              <li><a href="/gift-cards">Gift Cards</a></li>
              <li><a href="/utilities">Tiện ích</a></li>
              <li><a href="/contact">Liên hệ</a></li>
            </ul>
          </nav>

          {/* Search and Icons */}
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
              <FaSearch className="search-icon" />
              
              {/* Autocomplete Dropdown */}
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
                  <a href='/account/recharge' className="user-balance">
                    <span className="balance">{0}đ</span>
                  </a>
                  <a href='/account'><img src={user?.profileImg || "https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-512.png"} alt="User Avatar" className="user-avatar" /></a>
                </div>
              ) : (
                <div className="auth-links">
                  <a href="/login">Đăng nhập</a>
                  /
                  <a href="/register">Đăng ký</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
