import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

// Noto Emoji Animation URLs
const EMOJI_ANIMATIONS = {
  sparkles: 'https://fonts.gstatic.com/s/e/notoemoji/latest/2728/lottie.json',
  partyPopper: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f389/lottie.json',
  confettiBall: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f38a/lottie.json',
  rocket: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f680/lottie.json',
  star: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f31f/lottie.json',
  heartEyes: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f60d/lottie.json',
  laughingWithTears: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f602/lottie.json',
  thumbsUp: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f44d/lottie.json',
  clappingHands: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f44f/lottie.json',
  faceWithMonocle: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f9d0/lottie.json',
};

type EmojiType = keyof typeof EMOJI_ANIMATIONS;

interface AnimatedEmojiProps {
  type: EmojiType;
  size?: number;
  style?: React.CSSProperties;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
}

export function AnimatedEmoji({
  type,
  size = 50,
  style,
  className = '',
  loop = true,
  autoplay = true
}: AnimatedEmojiProps) {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    // Lazy load the animation data to improve performance
    fetch(EMOJI_ANIMATIONS[type])
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(error => console.error('Failed to load emoji animation:', error));
  }, [type]);

  if (!animationData) {
    return <div style={{ width: size, height: size }} className={className}></div>;
  }

  return (
    <Lottie
      animationData={animationData}
      loop={loop}
      autoplay={autoplay}
      style={{ width: size, height: size, ...style }}
      className={className}
    />
  );
}

interface FloatingEmojiProps {
  type: EmojiType;
  size?: number;
  delay?: number;
  duration?: number;
  className?: string;
}

export function FloatingEmoji({
  type,
  size = 40,
  delay = 0,
  duration = 10,
  className = ''
}: FloatingEmojiProps) {
  const animationStyle: React.CSSProperties = {
    position: 'absolute',
    animation: `float ${duration}s ease-in-out infinite ${delay}s`,
    zIndex: 10,
  };

  return (
    <div className={`floating-emoji ${className}`} style={animationStyle}>
      <AnimatedEmoji type={type} size={size} />
    </div>
  );
}

// Create a group of floating emojis to place around components
export function EmojiAnimationGroup() {
  return (
    <div className="emoji-animation-container">
      <FloatingEmoji type="sparkles" size={35} delay={0} className="absolute -top-2 -left-8" />
      <FloatingEmoji type="partyPopper" size={45} delay={1} className="absolute -top-10 right-10" />
      <FloatingEmoji type="star" size={30} delay={0.5} className="absolute bottom-5 -left-12" />
      <FloatingEmoji type="rocket" size={35} delay={1.5} className="absolute -bottom-8 right-0" />
    </div>
  );
} 