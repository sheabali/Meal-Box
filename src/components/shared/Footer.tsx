import React from 'react';

const Footer = () => {
  return (
    <div>
      <footer className="bg-gray-50 text-white py-4">
        <div className="container mx-auto text-center">
          <p className="text-black">
            &copy; {new Date().getFullYear()} Eat Clean. All rights reserved.
          </p>
          <p>
            <a
              href="/privacy-policy"
              className="text-gray-400 hover:text-white"
            >
              Privacy Policy
            </a>{' '}
            |{' '}
            <a
              href="/terms-of-service"
              className="text-gray-400 hover:text-white"
            >
              Terms of Service
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
