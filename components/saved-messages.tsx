"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getMessages, deleteMessage, clearAllMessages, type SavedMessage } from "@/lib/local-storage";
import { ChevronDown, ChevronUp, Copy, Trash, Trash2 } from "lucide-react";

export function SavedMessages() {
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved messages from local storage
    setMessages(getMessages());
    
    // Add event listener to update messages when storage changes
    const handleStorageChange = () => {
      setMessages(getMessages());
    };
    
    window.addEventListener("storage", handleStorageChange);
    
    // Custom event for internal updates
    window.addEventListener("emojitell-storage-update", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("emojitell-storage-update", handleStorageChange);
    };
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      description: "Your emoji message has been copied.",
    });
  };

  const handleDelete = (id: string) => {
    deleteMessage(id);
    setMessages(getMessages());
    toast({
      title: "Message deleted",
      description: "Your saved message has been removed.",
    });
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("emojitell-storage-update"));
  };

  const handleClearAll = () => {
    clearAllMessages();
    setMessages([]);
    toast({
      title: "All messages cleared",
      description: "All your saved messages have been removed.",
    });
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("emojitell-storage-update"));
  };

  return (
    <Card className="w-full max-w-3xl shadow-lg dark:shadow-blue-900/10">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="text-blue-600 dark:text-blue-400">Saved Messages</CardTitle>
            <CollapsibleTrigger
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-md p-2 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400"
            >
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </CollapsibleTrigger>
          </div>
          <CardDescription className="text-gray-600 dark:text-gray-300">
          Your previously saved emoji messages
          </CardDescription>
        </CardHeader>
        
        <CollapsibleContent>
          <CardContent className="pb-3">
            {messages.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground dark:text-gray-400">
                No saved messages yet. Convert and save some messages to see them here.
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <Card key={message.id} className="overflow-hidden border-blue-200 dark:border-blue-900">
                    <CardContent className="p-4">
                      <div className="mb-2 text-sm text-muted-foreground dark:text-gray-400">
                        {format(new Date(message.timestamp), "MMM d, yyyy 'at' h:mm a")}
                        <span className="ml-2 px-2 py-0.5 bg-muted dark:bg-slate-800 rounded-full text-xs">
                          {message.style}
                        </span>
                        {message.mode && (
                          <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs">
                            {message.mode === 'emoji-combo' ? 'Emoji Combo' : 
                              message.mode === 'emojify' ? 'Emojify' : 
                              message.mode === 'xiaohongshu' ? 'Line-by-Line Style' : 'Standard'}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground dark:text-gray-400 mb-2">
                        {message.originalText}
                      </div>
                      <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-md break-words dark:text-gray-200">
                        {message.emojiText}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 p-2 bg-gradient-to-r from-white to-blue-50 dark:from-slate-900 dark:to-blue-950/30">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900 dark:hover:text-blue-300 dark:text-gray-300"
                        onClick={() => handleCopy(message.emojiText)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/50 dark:hover:text-red-300 dark:text-gray-300"
                        onClick={() => handleDelete(message.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
          
          {messages.length > 0 && (
            <CardFooter className="pt-0 pb-4 bg-gradient-to-r from-white to-blue-50 dark:from-slate-900 dark:to-blue-950/30 rounded-b-lg">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-auto border-blue-300 hover:bg-red-100 hover:text-red-700 hover:border-red-300 transition-colors dark:border-blue-800 dark:hover:bg-red-900/50 dark:hover:text-red-300 dark:text-gray-300"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="dark:bg-slate-900 dark:border-blue-900">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="dark:text-gray-200">Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription className="dark:text-gray-400">
                    This action cannot be undone. This will permanently delete all your saved emoji messages.                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-gray-300 dark:border-blue-900">Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleClearAll}
                      className="dark:bg-red-900 dark:hover:bg-red-800 dark:text-white"
                    >
                      Delete All                    
                      </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          )}
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}