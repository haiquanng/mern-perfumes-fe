import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="text-xl font-bold text-white">Perfumery</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Your destination for luxury fragrances from the world's most prestigious brands.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 transition">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 transition">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 transition">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 transition">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop Section */}
          <div>
            <h3 className="text-white font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-purple-400 transition">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-purple-400 transition">
                  Women's Perfumes
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-purple-400 transition">
                  Men's Perfumes
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-purple-400 transition">
                  Unisex Fragrances
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-purple-400 transition">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/assistant" className="hover:text-purple-400 transition">
                  AI Assistant
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-purple-400 transition">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-400 transition">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-400 transition">
                  Returns Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-400 transition">
                  Track Order
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-purple-400 flex-shrink-0" />
                <span>123 Perfume Street, Fragrance City, FC 12345</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span>support@perfumery.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            &copy; {currentYear} Perfumery. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-purple-400 transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-purple-400 transition">
              Terms of Service
            </a>
            <a href="#" className="hover:text-purple-400 transition">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
