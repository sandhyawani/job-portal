import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand Info */}
        <div>
          <h2 className="text-2xl font-bold text-pink-400">YourBrand</h2>
          <p className="mt-3 text-gray-400 text-sm leading-relaxed">
            Empowering you with premium tools and resources to learn, grow, and succeed.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li><a href="/" className="hover:text-pink-400 transition">Home</a></li>
            <li><a href="/about" className="hover:text-pink-400 transition">About Us</a></li>
            <li><a href="/services" className="hover:text-pink-400 transition">Services</a></li>
            <li><a href="/contact" className="hover:text-pink-400 transition">Contact</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li><a href="/faq" className="hover:text-pink-400 transition">FAQs</a></li>
            <li><a href="/privacy" className="hover:text-pink-400 transition">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:text-pink-400 transition">Terms & Conditions</a></li>
            <li><a href="/help" className="hover:text-pink-400 transition">Help Center</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noreferrer"
              className="p-2 rounded-full bg-gray-700 hover:bg-pink-500 transition">
              <FaFacebookF size={16} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer"
              className="p-2 rounded-full bg-gray-700 hover:bg-pink-500 transition">
              <FaTwitter size={16} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"
              className="p-2 rounded-full bg-gray-700 hover:bg-pink-500 transition">
              <FaInstagram size={16} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer"
              className="p-2 rounded-full bg-gray-700 hover:bg-pink-500 transition">
              <FaLinkedinIn size={16} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} Job portal. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
