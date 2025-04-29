import React from 'react';
import NMContainer from '../ui/core/MBContainer';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-11">
      <NMContainer>
        <div className="grid gap-8 md:grid-cols-3">
          {/* Section 1: Company Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">About Us</h3>
            <p className="text-sm">
              Meal Planning & Delivery Web Application where users can
              personalize their meal plans and have meals delivered based on
              their dietary preferences and schedules.
            </p>
          </div>

          {/* Section 2: Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Section 3: Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">
              Contact Us
            </h3>
            <p className="text-sm">Email: iamskpranto@gmail.com</p>
            <p className="text-sm">Phone: +880 1737-886719</p>
          </div>
        </div>
      </NMContainer>

      {/* Bottom Footer */}
      <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm">
        <p>© 2025 Your Company. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
