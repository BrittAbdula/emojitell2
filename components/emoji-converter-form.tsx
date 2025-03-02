"use client";

import { useState } from "react";
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
    if (!inputText.trim() || !outputText.trim()) {
      toast({
        title: "No content to save",
        description: "Please convert some text first.",
        variant: "destructive",
      });
      return;
    }
    
    saveMessage({
      originalText: inputText,
      emojiText: outputText,
      style: emojiStyle,
      mode: translationMode,
    });
    
    toast({
      title: "Message saved!",
      description: "Your emoji message has been saved.",
    });
  };

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
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-t-lg">
        <CardTitle className="text-2xl font-bold text-blue-600 dark:text-blue-400">Emoji Translator</CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-300">
          Transform your plain text into creative and expressive emoji messages
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-6">
        {apiError && (
          <Alert 
            variant="warning" 
            dismissable 
            onDismiss={() => setApiError(null)}
            className="mb-4 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800"
          >
            <AlertTitle>API Error</AlertTitle>
            <AlertDescription>
              {apiError}. Using local translation as a fallback.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Input Text</label>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-950/50"
              onClick={handleExampleClick}
            >
              <BookOpen className="h-3.5 w-3.5 mr-1" />
              Use Example
            </Button>
          </div>
          <div className="relative">
            <Textarea
              placeholder="Enter your text here..."
              className="min-h-[120px] resize-y border-blue-200 focus:border-blue-400 focus:ring-blue-400 pr-4 pb-14 dark:border-blue-900 dark:bg-slate-900 dark:focus:border-blue-700 dark:focus:ring-blue-700 dark:placeholder-gray-500"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <div className="absolute bottom-3 right-3">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 transition-colors dark:bg-blue-800 dark:hover:bg-blue-700" 
                onClick={handleConvert}
                disabled={isLoading || !inputText.trim()}
                size="sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Translating...
                  </>
                ) : (
                  'Translate'
                )}
              </Button>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-3 block">Translation Mode</label>
          <RadioGroup 
            value={translationMode} 
            onValueChange={(value) => {
              setTranslationMode(value as TranslationMode);
              setOutputText("");
            }}
            className="flex flex-wrap gap-4"
          >
            <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 rounded-md border border-blue-200 dark:border-blue-900 px-3 py-2 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors cursor-pointer">
              <RadioGroupItem value="emoji-combo" id="emoji-combo" className="text-blue-600 dark:text-blue-400" />
              <Label htmlFor="emoji-combo" className="cursor-pointer dark:text-gray-300">Emoji Combo</Label>
            </div>
            <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 rounded-md border border-blue-200 dark:border-blue-900 px-3 py-2 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors cursor-pointer">
              <RadioGroupItem value="emojify" id="emojify" className="text-blue-600 dark:text-blue-400" />
              <Label htmlFor="emojify" className="cursor-pointer dark:text-gray-300">Emojify Text</Label>
            </div>
            <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 rounded-md border border-blue-200 dark:border-blue-900 px-3 py-2 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors cursor-pointer">
              <RadioGroupItem value="xiaohongshu" id="xiaohongshu" className="text-blue-600 dark:text-blue-400" />
              <Label htmlFor="xiaohongshu" className="cursor-pointer dark:text-gray-300">Line-by-Line Style</Label>
            </div>
          </RadioGroup>
        </div>
        
        {outputText && (
          <div className="mt-6 space-y-4">
            <Tabs 
              defaultValue="translation-result" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                <TabsTrigger 
                  value="translation-result"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-400"
                >
                  Translation Result
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="translation-result" className="mt-4">
                <Card className="border-blue-200 dark:border-blue-900">
                  <CardContent className="pt-6">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 p-6 rounded-md min-h-[100px] break-words text-lg dark:text-gray-200 whitespace-pre-line">
                      {outputText}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
        
        <div className="text-xs text-gray-500 dark:text-gray-400 italic mt-2">
          Note: Translations are provided by emojitell.com. Local translation will be used as a fallback for API connection issues.
        </div>
      </CardContent>
      
      {outputText && (
        <CardFooter className="flex flex-wrap justify-end gap-2 pb-6 bg-gradient-to-r from-white to-blue-50 dark:from-slate-900 dark:to-blue-950/30 rounded-b-lg">
          <Button
            variant="outline"
            size="sm"
            className="border-blue-300 hover:bg-blue-100 hover:text-blue-700 transition-colors dark:border-blue-800 dark:hover:bg-blue-900 dark:hover:text-blue-300 dark:text-gray-300"
            onClick={() => handleCopy(outputText)}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-blue-300 hover:bg-blue-100 hover:text-blue-700 transition-colors dark:border-blue-800 dark:hover:bg-blue-900 dark:hover:text-blue-300 dark:text-gray-300"
            onClick={handleSave}
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-blue-300 hover:bg-blue-100 hover:text-blue-700 transition-colors dark:border-blue-800 dark:hover:bg-blue-900 dark:hover:text-blue-300 dark:text-gray-300"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-blue-300 hover:bg-blue-100 hover:text-blue-700 transition-colors dark:border-blue-800 dark:hover:bg-blue-900 dark:hover:text-blue-300 dark:text-gray-300"
            onClick={() => {
              setInputText("");
              setOutputText("");
              setApiError(null);
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </CardFooter>
      )}
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