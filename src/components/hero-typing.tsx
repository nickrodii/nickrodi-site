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
        className: "mb-2 block w-fit text-2xl text-gray-400 sm:text-4xl xl:text-6xl",
      },
      {
        text: "nick",
        className: "block w-fit text-[3.75rem] leading-[0.95] sm:text-7xl lg:text-8xl xl:text-9xl",
      },
      {
        text: "rodi",
        className: "block w-fit text-[3.75rem] leading-[0.95] sm:text-7xl lg:text-8xl xl:text-9xl",
      },
    ];

    return scheduleLines(lines, startDelay, "left");
  }, [lineGap, startDelay, typingSpeed]);

  const rightLines = useMemo(() => {
    const lines: Omit<TypedLineConfig, "delay">[] = [
      {
        text: "an Honors Software Engineer at",
        className: "mb-2 block w-fit text-lg text-gray-400 sm:text-2xl xl:text-3xl",
      },
      {
        text: "Arizona State",
        className: "block w-fit text-[2.6rem] leading-tight text-yellow-100 sm:text-6xl lg:text-7xl",
      },
      {
        text: "University",
        className: "block w-fit text-[2.6rem] leading-tight text-yellow-100 sm:text-6xl lg:text-7xl",
      },
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
    <section id="hero" className="mx-auto mt-24 sm:mt-32 md:mt-40 xl:mt-50">
      <div className="flex flex-col gap-10 sm:gap-12 xl:flex-row xl:gap-16">
        <div className="max-w-none xl:max-w-md">
          <h1 className="flex flex-col items-start text-white font-bold font-plex-mono leading-tight">
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

        <div className="max-w-3xl xl:ml-auto xl:flex-1 xl:content-center">
          <h1 className="flex flex-col items-start text-white font-bold font-plex-mono leading-tight xl:w-full xl:items-end">
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
