"use client";

import { TranslationMode } from "./api";

// Type for saved emoji messages
export interface SavedMessage {
  id: string;
  originalText: string;
  emojiText: string;
  timestamp: number;
  style: string;
  mode?: TranslationMode;
}

// Key for local storage
const STORAGE_KEY = 'emojitell-saved-messages';

// Function to save a message to local storage
export function saveMessage(message: Omit<SavedMessage, 'id' | 'timestamp'>): SavedMessage {
  // Get existing messages
  const existingMessages = getMessages();
  
  // Create new message with ID and timestamp
  const newMessage: SavedMessage = {
    ...message,
    id: generateId(),
    timestamp: Date.now()
  };
  
  // Add new message to the beginning of the array
  const updatedMessages = [newMessage, ...existingMessages];
  
  // Save to local storage
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMessages));
  }
  
  return newMessage;
}

// Function to get all saved messages
export function getMessages(): SavedMessage[] {
  if (typeof window === 'undefined') {
    return [];
  }
  
  const messagesJson = localStorage.getItem(STORAGE_KEY);
  if (!messagesJson) {
    return [];
  }
  
  try {
    return JSON.parse(messagesJson);
  } catch (error) {
    console.error('Error parsing saved messages:', error);
    return [];
  }
}

// Function to delete a message
export function deleteMessage(id: string): void {
  const existingMessages = getMessages();
  const updatedMessages = existingMessages.filter(message => message.id !== id);
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMessages));
  }
}

// Function to clear all messages
export function clearAllMessages(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}

// Helper function to generate a unique ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}