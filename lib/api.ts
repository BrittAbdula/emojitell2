/**
 * API client for emojitell.com
 * This module provides functions to translate text into emojis using different modes.
 */

import { EmojiStyle } from "./emoji-converter";

/**
 * The available translation modes:
 * - emoji-combo: Converts text to pure emoji combinations (no original text)
 * - emojify: Adds relevant emojis to the text while preserving the original content
 * - xiaohongshu: Adds a relevant emoji at the beginning of each line (Xiaohongshu style)
 */
export type TranslationMode = "emoji-combo" | "emojify" | "xiaohongshu";

/**
 * Request structure for the translation API
 */
interface TranslationRequest {
  text: string;
  mode: TranslationMode;
  style?: string;
  stream?: boolean;
}

/**
 * Response structure from the translation API
 */
export interface TranslationResponse {
  success: boolean;
  translatedText: string;
  error?: string;
}

/**
 * Translates text to emojis using the specified mode and style.
 * 
 * @param text - The text to translate
 * @param mode - The translation mode to use
 * @param style - The emoji style to apply (standard, minimal, expressive, or random)
 * @param useStream - Whether to use streaming for the response (default: false)
 * @returns A promise with the translation response or ReadableStream for streaming
 */
export async function translateText(
  text: string,
  mode: TranslationMode = "emojify",
  style: EmojiStyle = "standard",
  useStream: boolean = false
): Promise<TranslationResponse | ReadableStream> {
  try {
    // API endpoint - adjust as needed for your deployment
    const API_URL = "https://api.emojitell.com";
    
    // For streaming response
    if (useStream) {
      // Create URL with query parameters for streaming
      const url = new URL(API_URL);
      url.searchParams.append('text', text);
      url.searchParams.append('mode', mode);
      url.searchParams.append('style', style);
      url.searchParams.append('stream', 'true');
      
      // Make GET request for streaming
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Accept": "text/event-stream",
        },
      });
      
      // Check if response is OK
      if (!response.ok) {
        throw new Error(`API error: ${response.status} - ${response.statusText || "Unknown error"}`);
      }
      
      // Return the stream directly
      return response.body as ReadableStream;
    }
    
    // For regular JSON response
    else {
      // Prepare request data
      const requestData = {
        text,
        mode,
        style
      };
      
      // Make POST request to API
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      
      // Check if response is OK
      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          translatedText: "",
          error: `API error: ${response.status} - ${errorText || "Unknown error"}`,
        };
      }
      
      // Parse response JSON
      const data = await response.json();
      
      // Return successful response
      return {
        success: true,
        translatedText: data.translatedText,
      };
    }
  } catch (error) {
    // Handle any errors
    return {
      success: false,
      translatedText: "",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Gets emoji recommendations for a given query.
 * This maintains compatibility with the original emoji recommendation API.
 * 
 * @param query - The text to get emoji recommendations for
 * @returns A ReadableStream of emoji recommendations
 */
export async function getEmojiRecommendations(query: string): Promise<ReadableStream> {
  try {
    // API endpoint
    const API_URL = "https://api.emojitell.com";
    
    // Create URL with query parameter
    const url = new URL(API_URL);
    url.searchParams.append('query', query);
    
    // Make request
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Accept": "text/event-stream",
      },
    });
    
    // Check if response is OK
    if (!response.ok) {
      throw new Error(`API error: ${response.status} - ${response.statusText || "Unknown error"}`);
    }
    
    // Return the stream directly
    return response.body as ReadableStream;
  } catch (error) {
    // Create a readable stream with an error message
    const encoder = new TextEncoder();
    const errorMessage = `Error: ${error instanceof Error ? error.message : "Unknown error"}`;
    
    return new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(`data: ${errorMessage}\n\n`));
        controller.close();
      }
    });
  }
} 