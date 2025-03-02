// Emoji mapping for common words and phrases
const emojiMap: Record<string, string[]> = {
  // Emotions
  "happy": ["😊", "😄", "🙂", "😁"],
  "sad": ["😢", "😭", "😔", "☹️"],
  "angry": ["😠", "😡", "🤬", "👿"],
  "love": ["❤️", "💕", "😍", "🥰"],
  "laugh": ["😂", "🤣", "😆", "😹"],
  "surprise": ["😮", "😲", "😯", "🙀"],
  "confused": ["😕", "🤔", "❓", "😵‍💫"],
  
  // Nature
  "sun": ["☀️", "🌞", "🌅", "🌄"],
  "moon": ["🌙", "🌛", "🌜", "🌝"],
  "star": ["⭐", "✨", "💫", "🌟"],
  "flower": ["🌸", "🌹", "🌻", "🌺"],
  "tree": ["🌲", "🌳", "🌴", "🎄"],
  "water": ["💧", "🌊", "🚿", "🌧️"],
  "fire": ["🔥", "🧨", "💥", "🎇"],
  
  // Animals
  "dog": ["🐶", "🐕", "🦮", "🐩"],
  "cat": ["🐱", "🐈", "😸", "😻"],
  "bird": ["🐦", "🦜", "🦢", "🦉"],
  "fish": ["🐠", "🐟", "🐡", "🦈"],
  
  // Food
  "pizza": ["🍕", "🧀", "🍅", "🍽️"],
  "burger": ["🍔", "🥪", "🥓", "🥩"],
  "fruit": ["🍎", "🍌", "🍓", "🍊"],
  "vegetable": ["🥦", "🥕", "🍆", "🌽"],
  
  // Activities
  "sleep": ["😴", "💤", "🛌", "🌙"],
  "work": ["💼", "👩‍💻", "👨‍💼", "📊"],
  "study": ["📚", "🧠", "✏️", "🎓"],
  "travel": ["✈️", "🧳", "🗺️", "🏝️"],
  "music": ["🎵", "🎶", "🎸", "🎤"],
  "sport": ["⚽", "🏀", "🎾", "🏆"],
  
  // Common words
  "yes": ["👍", "✅", "✔️", "🙌"],
  "no": ["👎", "❌", "🚫", "🙅"],
  "hello": ["👋", "🤗", "🙋", "💁"],
  "goodbye": ["👋", "✌️", "🚶", "💨"],
  "thanks": ["🙏", "💯", "🤝", "💐"],
  "please": ["🙏", "🥺", "🤲", "✨"],
  "sorry": ["😔", "🙇", "💔", "🤦"],
  "good": ["👍", "🌟", "💯", "🏆"],
  "bad": ["👎", "💩", "🚫", "⛔"],
  "cool": ["😎", "🆒", "👌", "🤙"],
  "hot": ["🔥", "🥵", "♨️", "🌡️"],
  "cold": ["❄️", "🥶", "⛄", "🧊"],
  "time": ["⏰", "⌚", "⏳", "📆"],
  "money": ["💰", "💵", "💸", "🤑"],
  "home": ["🏠", "🏡", "🛋️", "🛌"],
  "phone": ["📱", "☎️", "📞", "📲"],
  "heart": ["❤️", "💙", "💚", "💜"],
  "idea": ["💡", "🧠", "✨", "🤔"],
  "gift": ["🎁", "🎀", "🎊", "🎉"],
  "party": ["🎉", "🎊", "🥳", "🎈"],
};

// Emoji styles/themes
export const emojiStyles = {
  standard: "standard",
  minimal: "minimal",
  expressive: "expressive",
  random: "random",
} as const;

export type EmojiStyle = keyof typeof emojiStyles;

// Function to convert text to emojis
export function convertToEmojis(
  text: string, 
  style: EmojiStyle = "standard",
  customEmojis: Record<string, string[]> = {}
): string {
  // Combine default and custom emoji maps
  const combinedEmojiMap = { ...emojiMap, ...customEmojis };
  
  // Split text into words
  const words = text.toLowerCase().split(/\s+/);
  
  // Convert each word to emoji if possible
  const result = words.map(word => {
    // Remove punctuation for matching
    const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    
    if (combinedEmojiMap[cleanWord]) {
      const emojiOptions = combinedEmojiMap[cleanWord];
      
      // Select emoji based on style
      switch (style) {
        case "minimal":
          return emojiOptions[0]; // Just the first emoji
        case "expressive":
          return emojiOptions.join(""); // All emojis together
        case "random":
          return emojiOptions[Math.floor(Math.random() * emojiOptions.length)]; // Random emoji
        case "standard":
        default:
          // Return first two emojis if available
          return emojiOptions.slice(0, 2).join("");
      }
    }
    
    // If no emoji match, return the original word
    return word;
  });
  
  return result.join(" ");
}

// Function to generate a completely emoji-based message
export function generateEmojiMessage(
  text: string,
  style: EmojiStyle = "standard",
  customEmojis: Record<string, string[]> = {}
): string {
  // Combine default and custom emoji maps
  const combinedEmojiMap = { ...emojiMap, ...customEmojis };
  
  // Split text into words
  const words = text.toLowerCase().split(/\s+/);
  
  // Convert each word to emoji if possible
  const result = words.map(word => {
    // Remove punctuation for matching
    const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    
    if (combinedEmojiMap[cleanWord]) {
      const emojiOptions = combinedEmojiMap[cleanWord];
      
      // Select emoji based on style
      switch (style) {
        case "minimal":
          return emojiOptions[0]; // Just the first emoji
        case "expressive":
          return emojiOptions.join(""); // All emojis together
        case "random":
          return emojiOptions[Math.floor(Math.random() * emojiOptions.length)]; // Random emoji
        case "standard":
        default:
          // Return first emoji
          return emojiOptions[0];
      }
    }
    
    // If no emoji match, try to find a similar word
    for (const [key, emojis] of Object.entries(combinedEmojiMap)) {
      if (cleanWord.includes(key) || key.includes(cleanWord)) {
        return emojis[0];
      }
    }
    
    // If still no match, return a generic emoji
    return "📝";
  });
  
  return result.join(" ");
}