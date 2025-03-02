"use client";

import { MessageSquareText, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";
export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-blue-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm dark:border-blue-900 dark:bg-slate-900/90 dark:supports-[backdrop-filter]:bg-slate-900/80 dark:shadow-blue-950/10">
      <div className="flex h-16 items-center">
        
        <nav className="flex items-center space-x-6 lg:space-x-8 mx-6">
        <div className="flex items-center space-x-2 mr-4">
          <Image src="/logo.png" alt="EmojiTell Logo" width={32} height={32} />
          <span className="font-bold text-2xl text-blue-600 dark:text-blue-400">EmojiTell</span>
        </div>
          {/* <a
            href="#"
            className="text-sm font-medium text-blue-700 transition-colors hover:text-blue-500"
          >
            <MessageSquareText className="h-4 w-4 inline-block mr-1" />
            Translator
          </a> */}
        </nav>
        
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <a 
            href="https://chromewebstore.google.com/detail/emoji-keyboard-by-emojite/jlehmfkpbapdblngeobldmbpfndheifh?hl=pt-BR"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors flex items-center dark:bg-blue-700 dark:hover:bg-blue-600"
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
        </div>
      </div>
    </header>
  );
}