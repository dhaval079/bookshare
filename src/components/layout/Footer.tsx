'use client';

import Link from 'next/link';
import { Book, Mail, GitCommit, Twitter, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';
import NavLink from '../ui/NavLink';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    { icon: GitCommit, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
  ];
  
  const footerLinks = [
    { label: 'About', href: '#' },
    { label: 'Features', href: '#' },
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
    { label: 'Contact', href: '#' },
  ];
  
  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white border-t border-gray-200"
    >
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          {socialLinks.map((item) => {
            const Icon = item.icon;
            return (
              <motion.a
                key={item.label}
                href={item.href}
                className="text-gray-400 hover:text-gray-500"
                whileHover={{ scale: 1.1, color: '#3B82F6' }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="sr-only">{item.label}</span>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </motion.a>
            );
          })}
        </div>
        
        <div className="mt-8 md:order-1 md:mt-0">
          <div className="flex items-center justify-center md:justify-start">
            <Book className="h-6 w-6 text-blue-600 mr-2" />
            <span className="text-lg font-semibold text-gray-900">BookShare</span>
          </div>
          
          <nav className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <NavLink
                key={link.label}
                href={link.href}
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          
          <p className="mt-6 text-center text-xs leading-5 text-gray-500 md:text-left">
            &copy; {currentYear} BookShare. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}