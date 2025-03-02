export default {
  async fetch(request, env) {
    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // Parse request (support both GET and POST)
    let inputText = "";
    let mode = "emojify"; // Default mode
    let style = "standard"; // Default style (kept for compatibility)
    let streamOutput = false; // Whether to use streaming output
    
    if (request.method === "GET") {
      // Process GET request with query parameters
      const url = new URL(request.url);
      
      // Support both 'query' (old API) and 'text' (new API) parameters
      inputText = url.searchParams.get('query') || url.searchParams.get('text') || '';
      mode = url.searchParams.get('mode') || 'emoji-combo';
      style = url.searchParams.get('style') || 'standard';
      streamOutput = url.searchParams.get('stream') === 'true';
      
      // For backward compatibility - if query is provided without mode, assume it's the old emoji recommendation API
      if (url.searchParams.has('query') && !url.searchParams.has('mode')) {
        // This is the old API mode - emoji recommendation
        return handleEmojiRecommendation(inputText, env);
      }
    } else if (request.method === "POST") {
      // Process POST request with JSON body
      try {
        const body = await request.json();
        inputText = body.text || body.query || '';
        mode = body.mode || 'emojify';
        style = body.style || 'standard';
        streamOutput = body.stream === true;
        
        // For backward compatibility - if query is provided without mode, assume it's the old emoji recommendation API
        if (body.query && !body.mode) {
          return handleEmojiRecommendation(body.query, env);
        }
      } catch (error) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: "Invalid JSON body" 
        }), { 
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          } 
        });
      }
    }

    // Validate input
    if (!inputText) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: "No text provided" 
      }), { 
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        } 
      });
    }

    // Limit input length for API efficiency
    const truncatedText = inputText.slice(0, 1000);

    // Create prompt based on translation mode
    let systemPrompt = "";
    
    switch (mode) {
      case "emoji-combo":
        systemPrompt = `You are an emoji translation expert. Completely transform the input text into a sequence of emojis, replacing each word or concept with the most appropriate emoji.

Guidelines:
1. Replace EACH word or concept with 1-2 relevant emojis
2. For abstract concepts, choose emojis that express the underlying meaning
3. Keep emotional tone and context in mind
4. Do not include any text or explanations, ONLY emojis
5. Separate different thoughts with a space
6. For names or proper nouns, use appropriate categorical emojis`;
        break;
        
      case "emojify":
        systemPrompt = `Your task is to take the plain text message provided and convert it into an expressive, emoji-rich message that conveys the same meaning and intent. Replace key words and phrases with relevant emojis where appropriate to add visual interest and emotion. Use emojis creatively but ensure the message remains clear and easy to understand. Do not change the core message or add new information. Only respond with the emoji-rich message, Do not include any text or explanations.`;
        break;
        
      case "xiaohongshu":
        systemPrompt = `You are a social media content enhancer. Your task is to add a single relevant emoji at the beginning of each line of text, maintaining a style popular on social media platforms.

Guidelines:
1. Add exactly ONE emoji at the beginning of EACH non-empty line
2. Choose an emoji that represents the main topic or emotion of that specific line
3. Keep the original text completely unchanged after the emoji
4. Add a space between the emoji and the text
5. For empty lines, don't add any emoji
6. Use diverse, visually appealing emojis that enhance the content`;
        break;
        
      default:
        // Default to emojify if mode is unrecognized
        systemPrompt = `You are an emoji enhancement expert. Your task is to add relevant emojis to the input text while keeping the original content intact.

Guidelines:
1. Keep the entire original text unchanged
2. Add 1-2 relevant emojis after key words, phrases, or sentences
3. Place emojis immediately after the relevant word or at the end of sentences
4. Ensure emojis match the emotional tone and meaning of the text
5. Don't overuse emojis - be selective and meaningful
6. Respond with the enhanced text only`;
    }

    // Create messages for AI
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: truncatedText },
    ];

    try {
      // If streaming is requested, return streaming response
      if (streamOutput) {
        const stream = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
          messages,
          stream: true,
        });
        
        return new Response(stream, {
          headers: {
            "content-type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*"
          },
        });
      } 
      
      // Otherwise, return JSON response
      else {
        const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
          messages,
          max_tokens: 1000,
        });

        return new Response(JSON.stringify({
          success: true,
          translatedText: response.response,
          mode: mode,
          style: style
        }), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "max-age=3600"
          }
        });
      }
    } catch (error) {
      // Handle AI processing errors
      return new Response(JSON.stringify({
        success: false,
        error: "Error processing with AI: " + (error.message || "Unknown error"),
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  },
};

/**
 * Handle the original emoji recommendation API
 * This maintains backward compatibility with the old API
 */
async function handleEmojiRecommendation(query, env) {
  if (!query) {
    return new Response('No query provided', { status: 400 });
  }
  
  // Truncate query to 100 characters as in the original API
  const truncatedQuery = query.slice(0, 100);
  
  const messages = [
    { 
      role: "system", 
      content: `You are an emoji recommendation assistant. Your task is to suggest the 5 most relevant emojis based on the user's input, regardless of the input language. Follow these guidelines:
  
  1. Analyze the input carefully, considering its meaning, emotion, and context.
  2. Select emojis that best represent the input's core concepts or feelings.
  3. Ensure your selections are culturally appropriate and universally understood.
  4. For non-English inputs, consider both the literal meaning and cultural connotations.
  5. Respond only with the emoji characters, separated by spaces.
  6. Always provide exactly 5 emojis, no more, no less.
  
  Example:
  Input: "I love pizza"
  Output: 🍕 ❤️ 😋 🇮🇹 🍽️
  
  Input: "我很开心"
  Output: 😊 🎉 😄 👍 💖`
    },
    { role: "user", content: truncatedQuery },
  ];

  const stream = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
    messages,
    stream: true,
  });

  return new Response(stream, {
    headers: { 
      "content-type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*"
    },
  });
} 