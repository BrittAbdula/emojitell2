"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { EmojiConverterForm } from "@/components/emoji-converter-form";
import { SavedMessages } from "@/components/saved-messages";
import { CustomEmojiDialog } from "@/components/custom-emoji-dialog";
import { FloatingEmoji } from "@/components/animated-emoji";
import { Bookmark } from "lucide-react";

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
        <section className="w-full py-6 md:py-24 bg-gradient-to-b from-white to-blue-50 dark:from-slate-900 dark:to-blue-950">
          <div className="px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center mb-12">
              <div className="space-y-3">
                <div className="relative">
                  <FloatingEmoji type="sparkles" size={40} delay={0} className="absolute -top-10 -left-10 hidden md:block" />
                  <FloatingEmoji type="star" size={35} delay={1} className="absolute -top-10 -right-10 hidden md:block" />
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-blue-700 dark:text-blue-400">
                    Free Emoji Translator & Text to Emoji Converter
                  </h1>
                </div>
                <p className="mx-auto max-w-[700px] text-gray-600 dark:text-gray-300 md:text-xl">
                  Transform your plain text into creative and expressive emoji messages 
                </p>
              </div>
            </div>
            
            <div className="mx-auto flex w-full flex-col items-center space-y-10">
              <div className="w-full max-w-3xl">
                <div className="flex justify-end mb-2">
                  <CustomEmojiDialog onAddCustomEmoji={handleAddCustomEmoji} />
                </div>
                <div className="relative">
                  {/* 左侧动画 emoji - 移动端减少数量并调整位置 */}
                  <FloatingEmoji type="sparkles" size={40} delay={0} className="absolute -top-8 -left-12 hidden md:block" />
                  <FloatingEmoji type="star" size={25} delay={1.2} className="absolute top-1/4 -left-10 hidden md:block" />
                  <FloatingEmoji type="heartEyes" size={35} delay={0.8} className="absolute bottom-10 -left-14 hidden md:block" />
                  
                  {/* 小屏幕的动画 emoji - 只显示两个，位置更靠近边缘 */}
                  <FloatingEmoji type="sparkles" size={30} delay={0} className="absolute -top-4 -left-3 md:hidden" />
                  <FloatingEmoji type="heartEyes" size={25} delay={0.8} className="absolute bottom-8 -left-4 md:hidden" />
                  
                  {/* 右侧动画 emoji */}
                  <FloatingEmoji type="confettiBall" size={35} delay={0.3} className="absolute -top-6 -right-12 hidden md:block" />
                  <FloatingEmoji type="thumbsUp" size={30} delay={1.5} className="absolute top-1/3 -right-10 hidden md:block" />
                  <FloatingEmoji type="rocket" size={40} delay={0.7} className="absolute bottom-8 -right-14 hidden md:block" />
                  
                  {/* 小屏幕的动画 emoji - 右侧 */}
                  <FloatingEmoji type="thumbsUp" size={30} delay={0.5} className="absolute -top-4 -right-3 md:hidden" />
                  <FloatingEmoji type="rocket" size={25} delay={1.1} className="absolute bottom-8 -right-4 md:hidden" />
                  
                  <EmojiConverterForm customEmojis={customEmojis} />
                </div>
              </div>
              
              <div className="w-full max-w-3xl">
                <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400 text-center mb-6">Free Emoji Translation Modes</h2>
                <div className="grid gap-6 md:grid-cols-3 mb-8">
                  <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md dark:shadow-blue-900/10 p-6 border border-blue-100 dark:border-blue-900 flex flex-col items-center text-center">
                    <div className="text-4xl mb-3">💯🔤</div>
                    <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400 mb-2">Emoji Combo</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Our free emoji translator completely transforms your text into a sequence of emojis in any language, creating an expressive emoji-only message</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md dark:shadow-blue-900/10 p-6 border border-blue-100 dark:border-blue-900 flex flex-col items-center text-center">
                    <div className="text-4xl mb-3">😊 Hi!</div>
                    <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400 mb-2">Emojify Text</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">This multilingual emoji converter adds relevant emojis while keeping your original content intact, perfect for any language</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md dark:shadow-blue-900/10 p-6 border border-blue-100 dark:border-blue-900 flex flex-col items-center text-center">
                    <div className="text-4xl mb-3">💭 Line</div>
                    <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400 mb-2">Line-by-Line Style</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Our free emoji converter adds a relevant emoji at the beginning of each line, supporting all languages for beautiful social media posts</p>
                  </div>
                </div>
              </div>
              
              <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-lg p-6 shadow-md dark:shadow-blue-900/10 border border-blue-100 dark:border-blue-900">
                <h2 className="text-xl font-bold text-blue-700 dark:text-blue-400 mb-4">Why Use Our Free Emoji Translator?</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Emojis enrich digital communication by adding emotional context and visual elements to plain text. Our Free Emoji Translator and Converter helps you express yourself better in chats, social media posts, emails, and more by converting your messages into emoji-rich content in any language.
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Unlike other emoji converters that have language limitations, our emoji translator works with multiple languages including English, Spanish, French, Chinese, Japanese, and many more. With our completely free Chrome extension, you can use these emoji translation features directly in your browser. Get creative and make your messages stand out with perfectly matched emojis for any context.
                </p>
              </div>
              
              
              {/* 优雅灵动的使用案例展示区 */}
              <div id="use-cases" className="w-full max-w-3xl scroll-mt-20">
                <div className="relative">
                  <FloatingEmoji type="partyPopper" size={35} delay={0.5} className="absolute -top-4 -left-10 hidden md:block" />
                  <FloatingEmoji type="clappingHands" size={30} delay={1} className="absolute -top-4 -right-10 hidden md:block" />
                  
                  {/* 小屏幕的动画 emoji */}
                  <FloatingEmoji type="partyPopper" size={25} delay={0.5} className="absolute -top-3 -left-3 md:hidden" />
                  <FloatingEmoji type="clappingHands" size={25} delay={1} className="absolute -top-3 -right-3 md:hidden" />
                  
                  <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400 text-center mb-8">Creative Use Cases for Our Free Emoji Translator</h2>
                </div>
                
                {/* Emoji Combo 案例 */}
                <div className="mb-12">
                  <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-400 mb-4 flex items-center">
                    <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full px-3 py-1 text-sm mr-3">
                      Emoji Combo
                    </span>
                    Transform Entire Sentences to Emoji Combinations in Any Language
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
                        Perfect for concise expression, chat reactions, and social media status updates - our emoji translator works in all languages!
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
                        Great for quickly sharing moods and activities in any language with our free emoji translator
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
                    Add Relevant Emojis to Your Text in Multiple Languages
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
                        Enhances emotional expression in any language while preserving your original message with our free emoji converter
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
                        Adds visual impact to business and marketing messages in any language with our multilingual emoji translator
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
                    Add Relevant Emojis to the Beginning of Each Line in Any Language
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
                        Our free emoji translator makes structured notes, lists, and social media posts stand out in any language
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
                        Makes checklists more visually appealing in any language with our multilingual emoji converter
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* FAQ 部分 */}
              <div id="faq" className="w-full max-w-3xl scroll-mt-20 mt-12">
                <div className="relative">
                  <FloatingEmoji type="faceWithMonocle" size={35} delay={0.2} className="absolute -top-6 -left-10 hidden md:block" />
                  <FloatingEmoji type="laughingWithTears" size={30} delay={0.7} className="absolute -top-6 -right-10 hidden md:block" />
                  
                  {/* 小屏幕的动画 emoji */}
                  <FloatingEmoji type="faceWithMonocle" size={25} delay={0.2} className="absolute -top-4 -left-3 md:hidden" />
                  <FloatingEmoji type="laughingWithTears" size={25} delay={0.7} className="absolute -top-4 -right-3 md:hidden" />
                  
                  <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400 text-center mb-8">Frequently Asked Questions about Our Emoji Translator</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md dark:shadow-blue-900/10 p-6 border border-blue-100 dark:border-blue-900">
                    <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400 mb-2">What is EmojiTell Emoji Translator?</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      EmojiTell is an intelligent, free emoji translator that converts your text into emoji-rich messages using three different translation modes: Emoji Combo, Emojify Text, and Line-by-Line Style. Our emoji converter supports multiple languages and works on all devices.
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md dark:shadow-blue-900/10 p-6 border border-blue-100 dark:border-blue-900">
                    <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400 mb-2">Which languages does your emoji translator support?</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Our emoji converter supports multiple languages including English, Spanish, French, German, Italian, Portuguese, Chinese, Japanese, Korean, Russian, Arabic, and many more. The emoji translator automatically detects your language and finds the most appropriate emojis for your content.
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md dark:shadow-blue-900/10 p-6 border border-blue-100 dark:border-blue-900">
                    <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400 mb-2">Is this emoji translator really free?</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Yes! EmojiTell is 100% free to use with no hidden fees or premium features. You can translate unlimited text to emojis, save your translations, and even use our Chrome extension completely free of charge. We believe emoji translation should be accessible to everyone.
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md dark:shadow-blue-900/10 p-6 border border-blue-100 dark:border-blue-900">
                    <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400 mb-2">How does the streaming translation work?</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      The streaming translation shows results in real-time as they&apos;re generated, giving you immediate feedback instead of waiting for the entire translation to complete. This is especially useful for longer texts and provides a more interactive emoji conversion experience.
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md dark:shadow-blue-900/10 p-6 border border-blue-100 dark:border-blue-900">
                    <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400 mb-2">Can I save my emoji translations?</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Yes! After translating your text, you can save it by clicking the &ldquo;Save&rdquo; button. Saved translations are stored locally in your browser and can be accessed in the &ldquo;Saved Messages&rdquo; section of our emoji translator app.
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md dark:shadow-blue-900/10 p-6 border border-blue-100 dark:border-blue-900">
                    <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400 mb-2">What is the Chrome Extension for emoji translation?</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Our Chrome Extension brings EmojiTell&apos;s emoji translation capabilities directly into your browser. It allows you to quickly convert text to emojis without having to visit the website, making it convenient for daily use in emails, social media, and messaging platforms. The extension is free and supports all the same languages as our online emoji converter.
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md dark:shadow-blue-900/10 p-6 border border-blue-100 dark:border-blue-900">
                    <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400 mb-2">How can I add custom emoji mappings to the translator?</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Click the &ldquo;Add Custom Emoji&rdquo; button at the top of the translator. You can then specify words and their corresponding emojis. These custom mappings will enhance your personal emoji translation experience during the current session.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Saved Messages Section */}
        <section id="saved-messages" className="py-12 md:py-20 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-blue-950">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-blue-700 dark:text-blue-400">Your Saved Messages</h2>
            
            <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-lg shadow-md p-6 mb-8">
              <div className="text-center mb-8">
                <Bookmark className="h-12 w-12 mx-auto text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">Access Your Saved Translations</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  When you save a translation, it will appear here for easy access later. Your saved messages are stored locally on your device.
                </p>
              </div>
              
              <div id="saved-messages-container" className="space-y-4">
                {/* Placeholder for saved messages - these will be populated by JavaScript */}
                <div className="text-center text-gray-500 dark:text-gray-400 py-8 italic">
                  You don&apos;t have any saved messages yet. Translate something and click the save button to see it here!
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Note: Messages are saved locally in your browser. Clearing your browser data will remove saved messages.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />

      {/* Added to prevent hydration error with framer-motion */}
      <div id="portal" />
    </div>
  );
}