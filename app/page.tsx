"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { EmojiConverterForm } from "@/components/emoji-converter-form";
import { SavedMessages } from "@/components/saved-messages";
import { CustomEmojiDialog } from "@/components/custom-emoji-dialog";

export default function Home() {
  const [customEmojis, setCustomEmojis] = useState<Record<string, string[]>>({});

  const handleAddCustomEmoji = (word: string, emojis: string[]) => {
    setCustomEmojis(prev => ({
      ...prev,
      [word]: emojis
    }));
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 bg-gradient-to-b from-white to-blue-50 dark:from-slate-900 dark:to-blue-950">
          <div className="px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center mb-12">
              <div className="space-y-3">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-blue-700 dark:text-blue-400">
                  Emoji Translator & Converter
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-600 dark:text-gray-300 md:text-xl">
                  Transform your plain text into creative and expressive emoji messages with three different translation modes
                </p>
              </div>
            </div>
            
            <div className="mx-auto flex w-full flex-col items-center space-y-10">
              <div className="w-full max-w-3xl">
                <div className="flex justify-end mb-2">
                  <CustomEmojiDialog onAddCustomEmoji={handleAddCustomEmoji} />
                </div>
                <EmojiConverterForm customEmojis={customEmojis} />
              </div>
              
              <div className="w-full max-w-3xl">
                <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400 text-center mb-6">Translation Modes</h2>
                <div className="grid gap-6 md:grid-cols-3 mb-8">
                  <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md dark:shadow-blue-900/10 p-6 border border-blue-100 dark:border-blue-900 flex flex-col items-center text-center">
                    <div className="text-4xl mb-3">💯🔤</div>
                    <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400 mb-2">Emoji Combo</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Completely transforms your text into a sequence of emojis, replacing each word with emojis</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md dark:shadow-blue-900/10 p-6 border border-blue-100 dark:border-blue-900 flex flex-col items-center text-center">
                    <div className="text-4xl mb-3">😊 Hi!</div>
                    <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400 mb-2">Emojify Text</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Adds relevant emojis while keeping your original content intact</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md dark:shadow-blue-900/10 p-6 border border-blue-100 dark:border-blue-900 flex flex-col items-center text-center">
                    <div className="text-4xl mb-3">💭 Line</div>
                    <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400 mb-2">Line-by-Line Style</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Adds a relevant emoji at the beginning of each line, perfect for social media posts and messages</p>
                  </div>
                </div>
              </div>
              
              <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-lg p-6 shadow-md dark:shadow-blue-900/10 border border-blue-100 dark:border-blue-900">
                <h2 className="text-xl font-bold text-blue-700 dark:text-blue-400 mb-4">Why Use Emoji Translator?</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Emojis enrich digital communication by adding emotional context and visual elements to plain text. Our Emoji Translator helps you express yourself better in chats, social media posts, emails, and more by converting your messages into emoji-rich content.
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  With our Chrome extension, you can use these emoji translation features directly in your browser. Get creative and make your messages stand out with perfectly matched emojis for any context.
                </p>
              </div>
              
              <div className="w-full max-w-3xl mt-4">
                <SavedMessages />
              </div>
              
              {/* 优雅灵动的使用案例展示区 */}
              <div className="w-full max-w-3xl">
                <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400 text-center mb-8">Creative Use Cases</h2>
                
                {/* Emoji Combo 案例 */}
                <div className="mb-12">
                  <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-400 mb-4 flex items-center">
                    <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full px-3 py-1 text-sm mr-3">
                      Emoji Combo
                    </span>
                    Transform Entire Sentences to Emoji Combinations
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow border border-blue-100 dark:border-blue-900/50">
                      <div className="text-gray-700 dark:text-gray-300 mb-3 text-sm italic border-l-2 border-blue-300 dark:border-blue-700 pl-3">
                        &ldquo;I&apos;m so happy to see you! Let&apos;s go to the beach and have some coffee.&rdquo;
                      </div>
                      <div className="text-2xl leading-relaxed tracking-wide">
                        😊 👀 👋 🏖️ ☕
                      </div>
                      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                        Perfect for concise expression, chat reactions, and social media status updates
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow border border-blue-100 dark:border-blue-900/50">
                      <div className="text-gray-700 dark:text-gray-300 mb-3 text-sm italic border-l-2 border-blue-300 dark:border-blue-700 pl-3">
                        &ldquo;Celebrating my birthday with friends, cake and music!&rdquo;
                      </div>
                      <div className="text-2xl leading-relaxed tracking-wide">
                        🎉 🎂 👫 🍰 🎵
                      </div>
                      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                        Great for quickly sharing moods and activities without lengthy text
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Emojify Text 案例 */}
                <div className="mb-12">
                  <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-400 mb-4 flex items-center">
                    <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full px-3 py-1 text-sm mr-3">
                      Emojify Text
                    </span>
                    Add Relevant Emojis to Your Text
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow border border-blue-100 dark:border-blue-900/50">
                      <div className="text-gray-700 dark:text-gray-300 mb-3 text-sm italic border-l-2 border-blue-300 dark:border-blue-700 pl-3">
                        &ldquo;Just finished a great workout and feeling energized!&rdquo;
                      </div>
                      <div className="text-lg leading-relaxed">
                        💪 Just finished a great workout and feeling energized! ⚡
                      </div>
                      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                        Enhances emotional expression while preserving your original message
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow border border-blue-100 dark:border-blue-900/50">
                      <div className="text-gray-700 dark:text-gray-300 mb-3 text-sm italic border-l-2 border-blue-300 dark:border-blue-700 pl-3">
                        &ldquo;Big announcement! We&apos;re launching our new product next week.&rdquo;
                      </div>
                      <div className="text-lg leading-relaxed">
                        📢 Big announcement! We&apos;re launching our new product next week. 🚀
                      </div>
                      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                        Adds visual impact and attention to business and marketing messages
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Line-by-Line Style 案例 */}
                <div>
                  <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-400 mb-4 flex items-center">
                    <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full px-3 py-1 text-sm mr-3">
                      Line-by-Line Style
                    </span>
                    Add Relevant Emojis to the Beginning of Each Line
                  </h3>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow border border-blue-100 dark:border-blue-900/50">
                      <div className="text-gray-700 dark:text-gray-300 mb-3 text-sm italic border-l-2 border-blue-300 dark:border-blue-700 pl-3">
                        &ldquo;Morning routine started.<br/>Coffee is brewing.<br/>Time to check emails.<br/>Planning the day ahead.&rdquo;
                      </div>
                      <div className="text-lg leading-relaxed">
                        🌅 Morning routine started.<br/>
                        ☕ Coffee is brewing.<br/>
                        📧 Time to check emails.<br/>
                        📝 Planning the day ahead.
                      </div>
                      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                        Perfect for structured notes, lists, and social media posts, making each point stand out
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow border border-blue-100 dark:border-blue-900/50 mt-6">
                      <div className="text-gray-700 dark:text-gray-300 mb-3 text-sm italic border-l-2 border-blue-300 dark:border-blue-700 pl-3">
                        &ldquo;Trip planning checklist:<br/>Book flights and hotel.<br/>Pack essentials and camera.<br/>Exchange currency.<br/>Confirm reservations.&rdquo;
                      </div>
                      <div className="text-lg leading-relaxed">
                        🗒️ Trip planning checklist:<br/>
                        ✈️ Book flights and hotel.<br/>
                        🧳 Pack essentials and camera.<br/>
                        💱 Exchange currency.<br/>
                        📱 Confirm reservations.
                      </div>
                      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                        Makes checklists and step-by-step guides more visually appealing and easier to follow
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}