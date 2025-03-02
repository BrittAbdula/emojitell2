"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PlusCircle, X } from "lucide-react";

interface CustomEmojiDialogProps {
  onAddCustomEmoji: (word: string, emojis: string[]) => void;
}

export function CustomEmojiDialog({ onAddCustomEmoji }: CustomEmojiDialogProps) {
  const [word, setWord] = useState("");
  const [emojis, setEmojis] = useState("");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!word.trim()) {
      toast({
        title: "Word required",
        description: "Please enter a word to associate with emojis.",
        variant: "destructive",
      });
      return;
    }
    
    if (!emojis.trim()) {
      toast({
        title: "Emojis required",
        description: "Please enter at least one emoji.",
        variant: "destructive",
      });
      return;
    }
    
    // Split emojis by space or comma
    const emojiArray = emojis
      .split(/[\s,]+/)
      .filter(emoji => emoji.trim() !== "");
    
    if (emojiArray.length === 0) {
      toast({
        title: "Invalid emojis",
        description: "Please enter valid emojis separated by spaces or commas.",
        variant: "destructive",
      });
      return;
    }
    
    // Add custom emoji mapping
    onAddCustomEmoji(word.toLowerCase().trim(), emojiArray);
    
    // Reset form and close dialog
    setWord("");
    setEmojis("");
    setOpen(false);
    
    toast({
      title: "Custom emoji added!",
      description: `"${word}" will now convert to your custom emojis.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-colors dark:border-blue-800 dark:hover:bg-blue-900/50 dark:hover:text-blue-400 dark:text-gray-300"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Custom Emoji
        </Button>
      </DialogTrigger> */}
      <DialogContent className="sm:max-w-[425px] border-blue-200 dark:border-blue-900 dark:bg-slate-900">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 -m-4 p-4 rounded-t-lg">
            <DialogTitle className="text-blue-700 dark:text-blue-400">Add Custom Emoji</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300">
              Create your own word-to-emoji mappings for the converter.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="word" className="text-right text-gray-600 dark:text-gray-300">
                Word
              </Label>
              <Input
                id="word"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                className="col-span-3 border-blue-200 focus:border-blue-400 focus:ring-blue-400 dark:border-blue-900 dark:bg-slate-800 dark:focus:border-blue-700 dark:focus:ring-blue-700 dark:placeholder-gray-500"
                placeholder="e.g., awesome"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="emojis" className="text-right text-gray-600 dark:text-gray-300">
                Emojis
              </Label>
              <Input
                id="emojis"
                value={emojis}
                onChange={(e) => setEmojis(e.target.value)}
                className="col-span-3 border-blue-200 focus:border-blue-400 focus:ring-blue-400 dark:border-blue-900 dark:bg-slate-800 dark:focus:border-blue-700 dark:focus:ring-blue-700 dark:placeholder-gray-500"
                placeholder="e.g., 🤩 ✨ 🔥"
              />
            </div>
          </div>
          <DialogFooter className="bg-gradient-to-r from-white to-blue-50 dark:from-slate-900 dark:to-blue-950/30 -m-4 mt-0 p-4 rounded-b-lg pt-6">
            <Button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 transition-colors dark:bg-blue-800 dark:hover:bg-blue-700"
            >
              Add Mapping
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}