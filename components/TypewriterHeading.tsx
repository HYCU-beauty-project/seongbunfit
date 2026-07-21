"use client";

import { useEffect, useState } from "react";

interface Segment {
  text: string;
  className?: string;
}

// 한 줄 = 문자열 하나(text) 또는 스타일 다른 구간 여러 개(segments)
type Line = { text: string; className?: string } | { segments: Segment[] };

interface Props {
  lines: Line[];
  speed?: number; // ms per character
  startDelay?: number;
}

function lineSegments(line: Line): Segment[] {
  return "segments" in line ? line.segments : [{ text: line.text, className: line.className }];
}

function lineLength(line: Line): number {
  return lineSegments(line).reduce((sum, s) => sum + s.text.length, 0);
}

export default function TypewriterHeading({ lines, speed = 45, startDelay = 150 }: Props) {
  const fullLength = lines.reduce((sum, l) => sum + lineLength(l), 0);
  const [visibleCount, setVisibleCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // interval을 effect 스코프에 둬야 타이핑 도중 언마운트돼도 확실히 정리됨
    let interval: ReturnType<typeof setInterval> | undefined;
    const startTimer = setTimeout(() => {
      let i = 0;
      interval = setInterval(() => {
        i++;
        setVisibleCount(i);
        if (i >= fullLength) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(startTimer);
      if (interval !== undefined) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 렌더링 중 변수 mutate 금지(react-hooks/immutability)라서
  // 각 줄/구간의 누적 시작 위치를 렌더 전에 미리 계산해둠
  const lineStarts: number[] = [];
  let acc = 0;
  for (const line of lines) {
    lineStarts.push(acc);
    acc += lineLength(line);
  }

  return (
    <span>
      {lines.map((line, lineIdx) => {
        const segments = lineSegments(line);
        const lineStart = lineStarts[lineIdx];
        const lineLen = lineLength(line);
        const lineEnd = lineStart + lineLen;
        const isCurrentLine = visibleCount > lineStart && visibleCount <= lineEnd;

        const segStarts: number[] = [];
        let segAcc = lineStart;
        for (const seg of segments) {
          segStarts.push(segAcc);
          segAcc += seg.text.length;
        }

        return (
          <span key={lineIdx}>
            {segments.map((seg, segIdx) => {
              const segStart = segStarts[segIdx];
              const visibleInSeg = Math.max(0, Math.min(seg.text.length, visibleCount - segStart));
              return (
                <span key={segIdx} className={seg.className}>
                  {seg.text.slice(0, visibleInSeg)}
                </span>
              );
            })}
            {isCurrentLine && !done && (
              <span aria-hidden className="animate-pulse text-[var(--color-primary)]">
                |
              </span>
            )}
            {lineIdx < lines.length - 1 && <br />}
          </span>
        );
      })}
    </span>
  );
}
