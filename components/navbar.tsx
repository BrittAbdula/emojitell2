"use client";

import { useState } from "react";
import { Menu, X, MessageSquareText, Sparkles, Bookmark } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";
import { AnimatedEmoji } from "@/components/animated-emoji";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-blue-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm dark:border-blue-900 dark:bg-slate-900/90 dark:supports-[backdrop-filter]:bg-slate-900/80 dark:shadow-blue-950/10">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo section */}
          <div className="flex items-center space-x-2">
            <a href="/#" className="flex items-center space-x-2">
              <Image src="/logo.png" alt="EmojiTell Logo" width={32} height={32} />
              <span className="font-bold text-2xl text-blue-600 dark:text-blue-400">EmojiTell</span>
            </a>
          </div>
          
          {/* Desktop Navigation - hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <a
              href="#"
              className="text-sm font-medium text-blue-700 dark:text-blue-400 transition-colors hover:text-blue-500 dark:hover:text-blue-300"
            >
              Home
            </a>
            <a
              href="#use-cases"
              className="text-sm font-medium text-blue-700 dark:text-blue-400 transition-colors hover:text-blue-500 dark:hover:text-blue-300"
            >
              Use Cases
            </a>
            <a
              href="#faq"
              className="text-sm font-medium text-blue-700 dark:text-blue-400 transition-colors hover:text-blue-500 dark:hover:text-blue-300"
            >
              FAQ
            </a>
            <a
              href="#saved-messages"
              className="text-sm font-medium text-blue-700 dark:text-blue-400 transition-colors hover:text-blue-500 dark:hover:text-blue-300 flex items-center"
            >
              <Bookmark className="h-4 w-4 mr-1" />
              Saved Messages
            </a>
          </nav>
          
          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {/* Chrome Extension Button - Smaller on mobile */}
            <a 
              href="https://chromewebstore.google.com/detail/emoji-keyboard-by-emojite/jlehmfkpbapdblngeobldmbpfndheifh?hl=pt-BR"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors items-center dark:bg-blue-700 dark:hover:bg-blue-600"
              aria-label="Download Chrome Extension"
            >
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C8.21 0 4.831 1.757 2.632 4.501l3.953 6.848A5.454 5.454 0 0 1 12 6.545L12 0z" fill="#EA4335"/>
                <path d="M12 0v6.545c1.61 0 3.091.822 3.943 2.077l3.953-6.848A11.979 11.979 0 0 0 12 0z" fill="#FBBC05"/>
                <path d="M2.632 4.501C.903 6.759 0 9.549 0 12.452c0 1.836.426 3.566 1.15 5.132L5.2 10.78A5.453 5.453 0 0 1 6.545 12c0-1.61-.823-3.091-2.068-3.944L2.632 4.501z" fill="#4285F4"/>
                <path d="M12 18.364a5.455 5.455 0 0 1-6.798-6.038L1.15 17.584A11.950 11.950 0 0 0 12 24c3.059 0 5.845-1.152 7.961-3.039l-3.968-6.876A5.445 5.445 0 0 1 12 18.364z" fill="#34A853"/>
              </svg>
              Chrome Extension
            </a>
            
            {/* Mobile menu button - only visible on mobile */}
            <button 
              onClick={toggleMenu} 
              className="md:hidden p-2 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-md transition-colors"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu - Dropdown */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} py-4 border-t border-blue-100 dark:border-blue-900`}>
          <nav className="flex flex-col space-y-4 px-2 pb-3 pt-2">
            <a
              href="#"
              className="flex items-center px-3 py-2 text-base font-medium rounded-md text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </a>
            <a
              href="#use-cases"
              className="flex items-center px-3 py-2 text-base font-medium rounded-md text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Use Cases
            </a>
            <a
              href="#faq"
              className="flex items-center px-3 py-2 text-base font-medium rounded-md text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              FAQ
            </a>
            <a
              href="#saved-messages"
              className="flex items-center px-3 py-2 text-base font-medium rounded-md text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Bookmark className="h-4 w-4 mr-2" />
              Saved Messages
            </a>
            <a 
              href="https://chromewebstore.google.com/detail/emoji-keyboard-by-emojite/jlehmfkpbapdblngeobldmbpfndheifh?hl=pt-BR"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-3 py-2 text-base font-medium rounded-md text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors sm:hidden"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C8.21 0 4.831 1.757 2.632 4.501l3.953 6.848A5.454 5.454 0 0 1 12 6.545L12 0z" fill="#EA4335"/>
                <path d="M12 0v6.545c1.61 0 3.091.822 3.943 2.077l3.953-6.848A11.979 11.979 0 0 0 12 0z" fill="#FBBC05"/>
                <path d="M2.632 4.501C.903 6.759 0 9.549 0 12.452c0 1.836.426 3.566 1.15 5.132L5.2 10.78A5.453 5.453 0 0 1 6.545 12c0-1.61-.823-3.091-2.068-3.944L2.632 4.501z" fill="#4285F4"/>
                <path d="M12 18.364a5.455 5.455 0 0 1-6.798-6.038L1.15 17.584A11.950 11.950 0 0 0 12 24c3.059 0 5.845-1.152 7.961-3.039l-3.968-6.876A5.445 5.445 0 0 1 12 18.364z" fill="#34A853"/>
              </svg>
              Chrome Extension
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}