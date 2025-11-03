import React from 'react';
import logo from "../assets/logo-white.png";
import { Link } from 'react-router-dom';
import { RiTwitterXFill, RiLinkedinBoxFill  } from "react-icons/ri";
import { FaInstagram, FaFacebook } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="text-white bg-black">
      {/* Main Footer Content */}
      <div className="container py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 text-sm">
        {/* Company Info */}
        <div className="lg:col-span-2">
          <Link to="/" onClick={() => { window.scrollTo(0,0); }} className=""> 
            <img src={logo} alt='UrbanScope Logo' className='h-7' />
          </Link>
          <p className="text-gray-300 mt-4 mb-6"> 
            Empowering home seekers with smart insights to find the perfect property and elevate their living experience. 
          </p>
          <div className="flex space-x-4">
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-gray-700 p-1.5 text-lg rounded transition-colors">
              <span className="sr-only">x</span>
              <RiTwitterXFill />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-gray-700 p-1.5 text-lg rounded transition-colors">
              <span className="sr-only">LinkedIn</span>
              <RiLinkedinBoxFill />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-gray-700 p-1.5 text-lg rounded transition-colors">
              <span className="sr-only">Instagram</span>
              <FaInstagram />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-gray-700 p-1.5 text-lg rounded transition-colors">
              <span className="sr-only">Facebook</span>
              <FaFacebook />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-gray-300">
            <li><Link to="/explore" onClick={() => scrollTo(0,0)} className="hover:text-white transition-colors"> Browse Properties </Link></li>
            <li><Link to="/agents" className="hover:text-white transition-colors"> Our Agents </Link></li>
            <li><Link to="/neighborhoods" className="hover:text-white transition-colors"> Neighborhoods </Link></li>
            <li><Link to="/market-reports" className="hover:text-white transition-colors"> Market Reports </Link></li>
            <li><Link to="/blog" className="hover:text-white transition-colors"> Blog </Link></li>
            <li><Link to="/careers" className="hover:text-white transition-colors"> Careers </Link></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Services</h4>
          <ul className="space-y-2 text-gray-300">
            <li><Link to="/buy" className="hover:text-white transition-colors">Buy a Home</Link></li>
            <li><Link to="/sell" className="hover:text-white transition-colors">Sell a Home</Link></li>
            <li><Link to="/rent" className="hover:text-white transition-colors">Rentals</Link></li>
            <li className="text-gray-300">Land Acquisitions</li>
            <li className="text-gray-300">Shortlet Investments</li>
            <li className="text-gray-300">Property Inspections</li>
            <li><Link to="/valuation" className="hover:text-white transition-colors">Property Valuation</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Get in Touch</h4>
          <div className="space-y-3 text-gray-300">
            <div>
              <p className="font-semibold text-white">Email</p>
              <a href="mailto:business@urbanscope.com" className="hover:text-white transition-colors">business@urbanscope.com</a>
            </div>
            <div>
              <p className="font-medium text-white">Phone</p>
              <a href="tel:+234-902-2330-456" className="hover:text-white transition-colors"> +(234) 902 - 233 - 0456 </a>
            </div>
            <div>
              <p className="font-medium text-white">Office Hours</p>
              <p>Mon-Fri: 9AM-6PM</p>
              <p>Sat: 10AM-4PM</p>
            </div>
            <div>
              <p className="font-medium text-white">Address</p>
              <p>123 Property Lane<br /> Lagos, Nigeria. 10115</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="container border-t border-gray-800 py-8 pb-12 px-4 flex flex-col-reverse md:flex-row gap-4 justify-between items-start text-sm text-gray-400">
        <div className="">
          <p>
            &copy; 2025 UrbanScope Realty. All rights reserved.
          </p>
          <p className="mt-1 text-xs">
            Built by <a href="https://deraolisah.com/" target="_blank" rel="noopener noreferrer" className='underline hover:text-white'> Nathan </a>
          </p>
        </div>
        <div className="flex flex-wrap justify-start gap-x-6 gap-y-2 mb-4 md:mb-0">
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
          <Link to="/accessibility" className="hover:text-white transition-colors">Accessibility</Link>
          <Link to="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
          <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;