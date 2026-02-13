"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

type TypedLineConfig = {
  text: string;
  className: string;
  delay: number;
};

type TypedLineProps = {
  text: string;
  className: string;
  delay: number;
  showCursor: boolean;
  isTyping: boolean;
  speed?: number;
};

type ScheduledLine = {
  id: string;
  text: string;
  className: string;
  delay: number;
  duration: number;
};

type ScheduledLines = {
  lines: ScheduledLine[];
  endTime: number;
};
function useTypewriter(text: string, delay: number, speed: number) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let index = 0;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let intervalId: ReturnType<typeof setInterval> | undefined;

    setDisplayed("");
    setDone(false);

    timeoutId = setTimeout(() => {
      if (text.length === 0) {
        setDone(true);
        return;
      }

      index = 1;
      setDisplayed(text.slice(0, 1));

      if (text.length === 1) {
        setDone(true);
        return;
      }

      intervalId = setInterval(() => {
        index += 1;
        const nextValue = text.slice(0, index);
        setDisplayed(nextValue);
        if (index >= text.length) {
          clearInterval(intervalId);
          setDone(true);
        }
      }, speed);
    }, delay);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, delay, speed]);

  return { displayed, done };
}

function TypedLine({
  text,
  className,
  delay,
  showCursor,
  isTyping,
  speed = 45,
}: TypedLineProps) {
  const { displayed } = useTypewriter(text, delay, speed);
  const measureRef = useRef<HTMLSpanElement | null>(null);
  const [caretX, setCaretX] = useState(0);

  useLayoutEffect(() => {
    if (!measureRef.current) return;
    setCaretX(measureRef.current.offsetWidth);
  }, [displayed]);

  return (
    <span className={`${className} relative`}>
      <span className="invisible whitespace-pre">{text}</span>
      <span className="absolute inset-0">
        <span className="relative inline-block whitespace-pre">
          <span ref={measureRef}>{displayed}</span>
          {showCursor ? (
            <span
              aria-hidden="true"
              className={[
                "absolute left-0 top-0 h-[1em] w-[2px] bg-current opacity-80 transition-transform ease-linear",
                isTyping ? "" : "animate-caret",
              ].join(" ")}
              style={{
                transform: `translateX(${caretX}px)`,
                transitionDuration: "30ms",
              }}
            />
          ) : null}
        </span>
      </span>
    </span>
  );
}

export default function HeroTyping() {
  const typingSpeed = 45;
  const lineGap = 200;
  const startDelay = 150;
  const columnGap = 350;

  const scheduleLines = (
    lines: Omit<TypedLineConfig, "delay">[],
    baseDelay: number,
    prefix: string,
  ): ScheduledLines => {
    let cursor = baseDelay;
    const scheduled = lines.map((line, index) => {
      const delay = cursor;
      const duration = Math.max(0, (line.text.length - 1) * typingSpeed);
      cursor += duration + lineGap;
      return {
        ...line,
        id: `${prefix}-${index}`,
        delay,
        duration,
      };
    });

    const endTime = Math.max(baseDelay, cursor - lineGap);
    return { lines: scheduled, endTime };
  };

  const leftLines = useMemo(() => {
    const lines: Omit<TypedLineConfig, "delay">[] = [
      {
        text: "hello, i'm",
        className: "block text-6xl text-gray-400 mb-2",
      },
      { text: "nick", className: "block text-9xl" },
      { text: "rodi", className: "block text-9xl" },
    ];

    return scheduleLines(lines, startDelay, "left");
  }, [lineGap, startDelay, typingSpeed]);

  const rightLines = useMemo(() => {
    const lines: Omit<TypedLineConfig, "delay">[] = [
      {
        text: "an Honors Computer Science Student at",
        className: "block text-3xl text-gray-400 mb-2 float-right",
      },
      { text: "Arizona State", className: "block text-7xl float-right text-yellow-100" },
      { text: "University", className: "block text-7xl float-right text-yellow-100" },
    ];

    const rightStart = leftLines.endTime + columnGap;
    return scheduleLines(lines, rightStart, "right");
  }, [columnGap, leftLines.endTime, lineGap, typingSpeed]);

  const allLines = useMemo(
    () => [...leftLines.lines, ...rightLines.lines],
    [leftLines.lines, rightLines.lines],
  );

  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let rafId: number;
    const start = performance.now();
    const tick = (now: number) => {
      setElapsed(now - start);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const activeLineId = useMemo(() => {
    if (allLines.length === 0) return "";
    let activeIndex = 0;
    for (let i = 0; i < allLines.length; i += 1) {
      const line = allLines[i];
      const start = line.delay;
      const end = line.delay + line.duration;
      if (elapsed < start) {
        activeIndex = Math.max(0, i - 1);
        return allLines[activeIndex].id;
      }
      if (elapsed <= end) {
        return line.id;
      }
      activeIndex = i;
    }
    return allLines[activeIndex]?.id ?? "";
  }, [allLines, elapsed]);

  const cursorHold = 2500;
  const typingCompleteTime = rightLines.endTime;
  const cursorActive = elapsed <= typingCompleteTime + cursorHold;

  return (
    <section id="hero" className="mx-auto mt-50">
      <div className="flex gap-16">
        <div className="max-w-md">
          <h1 className="text-white font-bold font-plex-mono leading-tight">
          {leftLines.lines.map((line) => (
            <TypedLine
              key={line.id}
              text={line.text}
              className={line.className}
              delay={line.delay}
              speed={typingSpeed}
              showCursor={cursorActive && activeLineId === line.id}
              isTyping={cursorActive && elapsed <= line.delay + line.duration}
            />
          ))}
          </h1>
        </div>

        <div className="flex-1 content-center">
          <h1 className="text-white font-bold font-plex-mono leading-tight">
          {rightLines.lines.map((line) => (
            <TypedLine
              key={line.id}
              text={line.text}
              className={line.className}
              delay={line.delay}
              speed={typingSpeed}
              showCursor={cursorActive && activeLineId === line.id}
              isTyping={cursorActive && elapsed <= line.delay + line.duration}
            />
          ))}
          </h1>
        </div>
      </div>
    </section>
  );
}
