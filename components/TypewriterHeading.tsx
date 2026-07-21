"use client";

import { useEffect, useState } from "react";

interface Segment {
  text: string;
  className?: string;
}

// 한 줄은 문자열 하나(text)이거나, 서로 다르게 스타일링할 구간이 여러 개(segments)일 수 있어요.
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
    // interval을 effect 스코프에 두어야 타이핑 도중 언마운트돼도 확실히 정리돼요.
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

  // 렌더링 중에 변수를 mutate하면 안 되니까(react-hooks/immutability), 각 줄/구간의
  // 누적 시작 위치를 렌더 전에 미리 계산해둬요.
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
