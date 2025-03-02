export function Footer() {
  return (
    <footer className="border-t border-blue-100 dark:border-blue-900 py-6 md:py-0 bg-gradient-to-b from-white to-blue-50 dark:from-slate-900 dark:to-blue-950/30">
      <div className="flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-center text-sm leading-loose text-gray-600 dark:text-gray-400 md:text-left">
          © {new Date().getFullYear()} EmojiTell. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <a 
            href="/terms-of-service" 
            className="text-sm text-gray-600 dark:text-gray-400 underline underline-offset-4 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Terms
          </a>
          <a 
            href="/privacy-policy" 
            className="text-sm text-gray-600 dark:text-gray-400 underline underline-offset-4 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Privacy
          </a>
          <a 
            href="#" 
            className="text-sm text-gray-600 dark:text-gray-400 underline underline-offset-4 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}