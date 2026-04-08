import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

/** One word / token with optional Tailwind overrides (Aceternity-style API). */
export type TypewriterWord = { text: string; className?: string };

export type TypewriterEffectProps = {
  /** Explicit word list with per-word `className` (see Aceternity Typewriter Effect). */
  words?: TypewriterWord[];
  /** Plain sentence; split on whitespace into words when `words` is omitted. */
  text?: string;
  /** Applied to every word when using `text` mode. */
  defaultWordClassName?: string;
  /** Wrapper element classes (typography, spacing). */
  className?: string;
  /** Classes on the inner flex row (e.g. `justify-center` for centered headlines). */
  innerClassName?: string;
  /** Blinking cursor classes. */
  cursorClassName?: string;
  as?: keyof JSX.IntrinsicElements;
  /** Seconds between each word reveal. */
  wordDelay?: number;
  startDelayMs?: number;
  showCursor?: boolean;
};

function splitToWords(input: string): TypewriterWord[] {
  return input
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => ({ text: t }));
}

/**
 * Word-by-word typewriter reveal inspired by
 * https://ui.aceternity.com/components/typewriter-effect
 */
export function TypewriterEffect({
  words: wordsProp,
  text,
  defaultWordClassName = '',
  className = '',
  innerClassName = 'inline-flex flex-wrap gap-x-1 gap-y-1 items-baseline',
  cursorClassName = 'inline-block h-4 w-[3px] translate-y-0.5 bg-silver-light ml-1 align-middle animate-caret-blink',
  as: Tag = 'div',
  wordDelay = 0.12,
  startDelayMs = 200,
  showCursor = false,
}: TypewriterEffectProps) {
  const words = wordsProp ?? (text ? splitToWords(text) : []);
  const measureRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(measureRef, { once: true, amount: 0.2, margin: '0px 0px -10% 0px' });
  const reduceMotion = useReducedMotion();
  const [started, setStarted] = useState(false);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      setStarted(true);
      setComplete(true);
      return;
    }
    if (!inView) return;
    const t = window.setTimeout(() => setStarted(true), startDelayMs);
    return () => window.clearTimeout(t);
  }, [inView, reduceMotion, startDelayMs]);

  useEffect(() => {
    if (reduceMotion || !started || words.length === 0) return;
    const ms = words.length * wordDelay * 1000 + 600;
    const t = window.setTimeout(() => setComplete(true), ms);
    return () => window.clearTimeout(t);
  }, [started, reduceMotion, words.length, wordDelay]);

  const onWordDone = (index: number) => {
    window.dispatchEvent(new CustomEvent('typewriter:tick'));
    if (index === words.length - 1) {
      window.dispatchEvent(new CustomEvent('typewriter:done'));
    }
  };

  return (
    <Tag className={className}>
      <span ref={measureRef} className={innerClassName}>
        {words.map((word, i) => {
          const cls = `inline-block ${defaultWordClassName} ${word.className ?? ''}`.trim();
          if (reduceMotion) {
            return (
              <span key={`${word.text}-${i}`} className={cls}>
                {word.text}
              </span>
            );
          }
          return (
            <motion.span
              key={`${word.text}-${i}`}
              className={cls}
              initial={{ opacity: 0, filter: 'blur(8px)', y: 4 }}
              animate={
                started
                  ? { opacity: 1, filter: 'blur(0px)', y: 0 }
                  : false
              }
              transition={{
                duration: 0.35,
                delay: i * wordDelay,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              onAnimationComplete={() => {
                onWordDone(i);
              }}
            >
              {word.text}
            </motion.span>
          );
        })}
      </span>
      {showCursor && !complete && started && !reduceMotion && (
        <span className={cursorClassName} aria-hidden />
      )}
    </Tag>
  );
}
