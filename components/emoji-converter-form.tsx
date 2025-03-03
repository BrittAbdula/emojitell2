"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { convertToEmojis, generateEmojiMessage, emojiStyles, type EmojiStyle } from "@/lib/emoji-converter";
import { saveMessage } from "@/lib/local-storage";
import { translateText, TranslationMode } from "@/lib/api";
import { Copy, Save, Share2, Loader2, RefreshCw, BookOpen } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AnimatedEmoji } from "@/components/animated-emoji";

interface EmojiConverterFormProps {
  customEmojis?: Record<string, string[]>;
}

export function EmojiConverterForm({ customEmojis = {} }: EmojiConverterFormProps) {
  const [inputText, setInputText] = useState("");
  const [emojiStyle, setEmojiStyle] = useState<EmojiStyle>("standard");
  const [translationMode, setTranslationMode] = useState<TranslationMode>("emojify");
  const [outputText, setOutputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("translation-result");
  const [apiError, setApiError] = useState<string | null>(null);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const { toast } = useToast();

  // 示例文本
  const examples = {
    "emoji-combo": "I am happy to see you today. Let's celebrate with pizza and music!",
    "emojify": "Good morning! I had coffee and breakfast. Now I'm ready to work on my project.",
    "xiaohongshu": "Just got a new plant for my desk.\nMade delicious pasta for dinner.\nGoing hiking this weekend with friends."
  };

  const handleExampleClick = () => {
    setInputText(examples[translationMode]);
  };

  const handleConvert = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Empty Input",
        description: "Please enter some text to convert.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setApiError(null);
    setOutputText(""); // Clear previous output
    
    try {
      // Use API for translation with streaming enabled
      const apiResponse = await translateText(
        inputText,
        translationMode,
        emojiStyle,
        true // Enable streaming
      );
      
      // Type guard to check if apiResponse is a ReadableStream
      if ('success' in apiResponse) {
        // Non-streaming response (fallback)
        if (apiResponse.success) {
          setOutputText(apiResponse.translatedText);
          
          toast({
            title: "Translation successful!",
            description: "Your text has been converted to emojis.",
          });

          // 显示成功动画
          setShowSuccessAnimation(true);
          setTimeout(() => setShowSuccessAnimation(false), 3000); // 3秒后隐藏动画
        } else {
          // Fall back to client-side translation if API fails
          let fallbackText = "";
          
          switch (translationMode) {
            case "emoji-combo":
              fallbackText = generateEmojiMessage(inputText, emojiStyle, customEmojis);
              break;
            case "emojify":
              fallbackText = convertToEmojis(inputText, emojiStyle, customEmojis);
              break;
            case "xiaohongshu":
              fallbackText = addEmojiToLines(inputText, emojiStyle, customEmojis);
              break;
          }
          
          setOutputText(fallbackText);
          
          // Set error message if there is an API error
          if (apiResponse.error) {
            setApiError(apiResponse.error);
          }
          
          toast({
            title: "Using local translation",
            description: "API connection failed. Using local translation instead.",
            variant: "default",
          });

          // 显示成功动画（即使是本地翻译）
          setShowSuccessAnimation(true);
          setTimeout(() => setShowSuccessAnimation(false), 3000); // 3秒后隐藏动画
        }
      } else {
        // This is a ReadableStream - process the stream
        const reader = apiResponse.getReader();
        const decoder = new TextDecoder("utf-8");
        let done = false;
        
        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          
          if (value) {
            const decodedChunk = decoder.decode(value, { stream: !done });
            
            // Process the stream data - handle the server-sent events format
            // The format is 'data: {"response":"text","p":"hash"}'
            const lines = decodedChunk.split('\n\n');
            for (const line of lines) {
              if (line.trim().startsWith('data: ')) {
                try {
                  // Extract the JSON part
                  const jsonStr = line.trim().substring(6); // Remove 'data: ' prefix
                  const data = JSON.parse(jsonStr);
                  
                  if (data && data.response !== undefined) {
                    // Only append the actual response text
                    setOutputText(current => current + data.response);
                  }
                } catch (e) {
                  // If JSON parsing fails, just add the text as is
                  console.error('Error parsing streaming response:', e);
                }
              }
            }
          }
        }
    
    toast({
          title: "Translation successful!",
      description: "Your text has been converted to emojis.",
        });

        // 显示成功动画
        setShowSuccessAnimation(true);
        setTimeout(() => setShowSuccessAnimation(false), 3000); // 3秒后隐藏动画
      }
    } catch (error) {
      console.error("Translation error:", error);
      setApiError(error instanceof Error ? error.message : "Unknown error");
      
      // Fall back to client-side translation if API fails
      let fallbackText = "";
      
      switch (translationMode) {
        case "emoji-combo":
          fallbackText = generateEmojiMessage(inputText, emojiStyle, customEmojis);
          break;
        case "emojify":
          fallbackText = convertToEmojis(inputText, emojiStyle, customEmojis);
          break;
        case "xiaohongshu":
          fallbackText = addEmojiToLines(inputText, emojiStyle, customEmojis);
          break;
      }
      
      setOutputText(fallbackText);
      
      toast({
        title: "Using local translation",
        description: "API connection failed. Using local translation instead.",
        variant: "default",
      });

      // 显示成功动画（即使是本地翻译）
      setShowSuccessAnimation(true);
      setTimeout(() => setShowSuccessAnimation(false), 3000); // 3秒后隐藏动画
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function for xiaohongshu-style translation
  const addEmojiToLines = (text: string, style: EmojiStyle, customEmojis: Record<string, string[]>): string => {
    // Split text into lines
    const lines = text.split("\n");
    
    // Process each line to add an emoji at the beginning
    const processedLines = lines.map(line => {
      if (!line.trim()) return line; // Skip empty lines
      
      // Get the first few words to determine the mood/context
      const words = line.toLowerCase().split(/\s+/).slice(0, 3);
      const context = words.join(" ");
      
      // Find a relevant emoji
      let emoji = "📝"; // Default emoji
      
      // Combine default and custom emoji maps from emoji-converter.ts
      const combinedEmojiMap = { ...emojiMap, ...customEmojis };
      
      for (const word of words) {
        const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
        
        if (combinedEmojiMap[cleanWord]) {
          const emojiOptions = combinedEmojiMap[cleanWord];
          
          // Select emoji based on style
          switch (style) {
            case "minimal":
              emoji = emojiOptions[0];
              break;
            case "expressive":
              emoji = emojiOptions[0];
              break;
            case "random":
              emoji = emojiOptions[Math.floor(Math.random() * emojiOptions.length)];
              break;
            case "standard":
            default:
              emoji = emojiOptions[0];
              break;
          }
          
          break; // Found an emoji, no need to check other words
        }
      }
      
      return `${emoji} ${line}`;
    });
    
    return processedLines.join("\n");
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      description: "Your emoji message has been copied.",
    });
  };

  const handleSave = () => {
    if (!outputText) return;
    
    try {
      // 创建一个保存的消息对象
      const savedMessage = {
        id: Date.now(), // 使用时间戳作为唯一ID
        text: outputText,
        mode: translationMode,
        date: new Date().toISOString(),
      };
      
      // 从localStorage获取现有保存的消息
      const savedMessages = localStorage.getItem('savedMessages');
      let messages = savedMessages ? JSON.parse(savedMessages) : [];
      
      // 添加新消息到数组开头
      messages.unshift(savedMessage);
      
      // 限制保存的消息数量（可选，例如最多保存20条）
      if (messages.length > 20) {
        messages = messages.slice(0, 20);
      }
      
      // 保存回localStorage
      localStorage.setItem('savedMessages', JSON.stringify(messages));
      
      // 更新保存的消息显示（如果页面上有相应元素）
      updateSavedMessagesDisplay();
      
      // 显示成功消息
      toast({
        title: "Message saved!",
        description: "Your emoji message has been saved.",
      });
    } catch (error) {
      console.error("Error saving translation:", error);
      toast({
        title: "Save failed",
        description: "Failed to save translation.",
        variant: "destructive",
      });
    }
  };
  
  // 更新保存的消息显示
  const updateSavedMessagesDisplay = () => {
    // 检查保存的消息容器是否存在
    const container = document.getElementById('saved-messages-container');
    if (!container) return;
    
    // 获取保存的消息
    const savedMessages = localStorage.getItem('savedMessages');
    const messages = savedMessages ? JSON.parse(savedMessages) : [];
    
    // 清空容器
    container.innerHTML = '';
    
    // 如果没有保存的消息，显示提示文本
    if (messages.length === 0) {
      container.innerHTML = `
        <div class="text-center text-gray-500 dark:text-gray-400 py-8 italic">
          You don't have any saved messages yet. Translate something and click the save button to see it here!
        </div>
      `;
      return;
    }

    // 定义消息类型
    interface SavedMessage {
      id: number;
      text: string;
      mode: string;
      date: string;
    }
    
    // 遍历消息并创建元素
    messages.forEach((message: SavedMessage) => {
      const messageElement = document.createElement('div');
      messageElement.className = 'bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 border border-blue-100 dark:border-blue-800';
      
      // 格式化日期
      const date = new Date(message.date);
      const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
      
      // 设置消息内容
      messageElement.innerHTML = `
        <div class="flex justify-between items-start mb-2">
          <div class="text-xs text-gray-500 dark:text-gray-400">${formattedDate}</div>
          <div class="text-xs font-medium px-2 py-1 bg-blue-100 dark:bg-blue-800 rounded text-blue-600 dark:text-blue-300">
            ${message.mode === 'emoji-combo' ? 'Emoji Combo' : 
              message.mode === 'emojify' ? 'Emojify Text' : 'Line-by-Line'}
          </div>
        </div>
        <div class="whitespace-pre-line text-gray-900 dark:text-gray-100 text-sm">
          ${message.text}
        </div>
        <div class="flex justify-end mt-2 gap-2">
          <button class="copy-btn text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/50" data-text="${message.text.replace(/"/g, '&quot;')}">
            Copy
          </button>
          <button class="delete-btn text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/50" data-id="${message.id}">
            Delete
          </button>
        </div>
      `;
      
      // 添加到容器
      container.appendChild(messageElement);
    });
    
    // 添加事件监听器
    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const text = (e.currentTarget as HTMLElement).dataset.text || '';
        navigator.clipboard.writeText(text)
          .then(() => {
            toast({
              title: "Copied!",
              description: "Text copied to clipboard.",
            });
          })
          .catch(() => {
            toast({
              title: "Copy failed",
              description: "Failed to copy text.",
              variant: "destructive",
            });
          });
      });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).dataset.id;
        if (!id) return;
        
        // 获取消息并删除指定ID的消息
        const savedMessages = localStorage.getItem('savedMessages');
        if (!savedMessages) return;
        
        let messages = JSON.parse(savedMessages);
        messages = messages.filter((m: { id: number }) => m.id.toString() !== id);
        
        // 保存回localStorage
        localStorage.setItem('savedMessages', JSON.stringify(messages));
        
        // 更新显示
        updateSavedMessagesDisplay();
    
    toast({
          title: "Message deleted",
          description: "Your saved message has been removed.",
        });
      });
    });
  };
  
  // 在组件挂载后加载保存的消息
  useEffect(() => {
    // 延迟执行以确保DOM已完全加载
    const timer = setTimeout(() => {
      updateSavedMessagesDisplay();
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleShare = () => {
    if (!outputText.trim()) {
      toast({
        title: "No content to share",
        description: "Please convert some text first.",
        variant: "destructive",
      });
      return;
    }
    
    // Create share data
    const shareData = {
      title: "Emojitell Message",
      text: outputText,
      url: window.location.href,
    };
    
    // Check if Web Share API is available
    if (navigator.share && navigator.canShare(shareData)) {
      navigator.share(shareData)
        .then(() => {
          toast({
            title: "Shared successfully!",
            description: "Your emoji message has been shared.",
          });
        })
        .catch((error) => {
          console.error("Share error:", error);
          handleCopy(outputText);
        });
    } else {
      // Fallback to copy if Web Share API is not available
      handleCopy(outputText);
      toast({
        title: "Copied for sharing!",
        description: "Your emoji message has been copied to the clipboard.",
      });
    }
  };

  return (
    <Card className="w-full max-w-3xl shadow-lg dark:shadow-blue-900/10">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-t-lg py-4">
        <CardTitle className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">Emoji Translator</CardTitle>
        <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
          Transform your text into emoji messages
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 pt-4">
        {apiError && (
          <Alert 
            variant="warning" 
            dismissable 
            onDismiss={() => setApiError(null)}
            className="mb-2 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800 text-xs md:text-sm"
          >
            <AlertTitle>API Error</AlertTitle>
            <AlertDescription>
              {apiError}. Using local translation as a fallback.
            </AlertDescription>
          </Alert>
        )}
        
        {/* 双栏布局：桌面端并排显示输入和输出，移动端上下堆叠 */}
        <div className="flex flex-col md:flex-row md:gap-4">
          {/* 左侧：输入区域 */}
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Input Text</label>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-950/50 px-2"
                onClick={handleExampleClick}
              >
                <BookOpen className="h-3 w-3 mr-1" />
                <span className="text-xs">Example</span>
              </Button>
            </div>
            <div className="relative">
          <Textarea
                placeholder="Enter your text here..."
                className="min-h-[100px] md:min-h-[180px] resize-y border-blue-200 focus:border-blue-400 focus:ring-blue-400 pr-4 pb-14 dark:border-blue-900 dark:bg-slate-900 dark:focus:border-blue-700 dark:focus:ring-blue-700 dark:placeholder-gray-500 text-sm"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
              <div className="absolute bottom-3 right-3 flex space-x-2">
                <Button 
                  variant="outline"
                  className="border-blue-300 hover:bg-blue-50 transition-colors dark:border-blue-800 dark:hover:bg-blue-900/30 h-8" 
                  onClick={() => {
                    setInputText("");
                    setOutputText("");
                    setApiError(null);
                  }}
                  size="sm"
                  disabled={isLoading || !inputText.trim()}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  <span className="text-xs">Clear</span>
                </Button>
          <Button 
                  className="bg-blue-600 hover:bg-blue-700 transition-colors dark:bg-blue-800 dark:hover:bg-blue-700 h-8" 
            onClick={handleConvert}
                  disabled={isLoading || !inputText.trim()}
                  size="sm"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      <span className="sm:inline hidden text-xs">Translating...</span>
                      <span className="sm:hidden">...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xs">Translate</span>
                    </>
                  )}
          </Button>
        </div>
                    </div>
          </div>
          
          {/* 右侧：输出区域（始终显示） */}
          <div className="flex-1 mt-3 md:mt-0">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Translation Result</label>
              <div className="flex space-x-1">
          <Button
                  variant="ghost"
            size="sm"
                  className="h-7 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-950/50 px-1.5"
                  onClick={() => handleCopy(outputText)}
                  disabled={!outputText}
          >
                  <Copy className="h-3 w-3" />
          </Button>
          <Button
                  variant="ghost"
            size="sm"
                  className="h-7 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-950/50 px-1.5"
            onClick={handleSave}
                  disabled={!outputText}
          >
                  <Save className="h-3 w-3" />
          </Button>
          <Button
                  variant="ghost"
            size="sm"
                  className="h-7 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-950/50 px-1.5"
            onClick={handleShare}
                  disabled={!outputText}
                >
                  <Share2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <div className="relative">              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 p-4 rounded-md min-h-[100px] md:min-h-[180px] break-words text-sm md:text-base dark:text-gray-200 whitespace-pre-line border border-blue-100 dark:border-blue-900">
                {outputText || 
                  <span className="text-gray-400 dark:text-gray-500 italic text-sm">
                    Your translation will appear here after you click Translate...
                  </span>
                }
              </div>
            </div>
          </div>
        </div>
        
        {/* 翻译模式选择 - 更加紧凑的布局 */}
        <div className="space-y-1 mt-3">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-300 block">Translation Mode</label>
          <RadioGroup 
            value={translationMode} 
            onValueChange={(value) => {
              setTranslationMode(value as TranslationMode);
              setOutputText("");
            }}
            className="flex flex-wrap gap-2"
          >
            <div className="flex items-center space-x-1 bg-white dark:bg-slate-900 rounded-md border border-blue-200 dark:border-blue-900 px-2 py-1 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors cursor-pointer">
              <RadioGroupItem value="emoji-combo" id="emoji-combo" className="text-blue-600 dark:text-blue-400 h-3 w-3" />
              <Label htmlFor="emoji-combo" className="cursor-pointer dark:text-gray-300 text-xs">Emoji Combo</Label>
            </div>
            <div className="flex items-center space-x-1 bg-white dark:bg-slate-900 rounded-md border border-blue-200 dark:border-blue-900 px-2 py-1 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors cursor-pointer">
              <RadioGroupItem value="emojify" id="emojify" className="text-blue-600 dark:text-blue-400 h-3 w-3" />
              <Label htmlFor="emojify" className="cursor-pointer dark:text-gray-300 text-xs">Emojify Text</Label>
            </div>
            <div className="flex items-center space-x-1 bg-white dark:bg-slate-900 rounded-md border border-blue-200 dark:border-blue-900 px-2 py-1 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors cursor-pointer">
              <RadioGroupItem value="xiaohongshu" id="xiaohongshu" className="text-blue-600 dark:text-blue-400 h-3 w-3" />
              <Label htmlFor="xiaohongshu" className="cursor-pointer dark:text-gray-300 text-xs">Line-by-Line</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="text-xs text-gray-500 dark:text-gray-400 italic mt-1">
          Note: Translations are provided by emojitell.com. Local translation will be used as a fallback.
        </div>
      </CardContent>
    </Card>
  );
}

// Reference to emojiMap from the emoji-converter.ts file
// Used for the xiaohongshu-style translation fallback
const emojiMap: Record<string, string[]> = {
  // Emotions
  "happy": ["😊", "😄", "🙂", "😁"],
  "sad": ["😢", "😭", "😔", "☹️"],
  "angry": ["😠", "😡", "🤬", "👿"],
  "love": ["❤️", "💕", "😍", "🥰"],
  "laugh": ["😂", "🤣", "😆", "😹"],
  "surprise": ["😮", "😲", "😯", "🙀"],
  "confused": ["😕", "🤔", "❓", "😵‍💫"],
  // Add more as needed for fallback functionality
};