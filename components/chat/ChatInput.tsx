'use client';

import { useState, type ReactNode } from 'react';
import ArrowRightIcon from '@/components/ArrowRightIcon';

interface Props {
    onSubmit: (text: string) => void;
    placeholder?: string;
    disabled?: boolean;
    // 입력창 왼쪽에 붙는 버튼 자리예요(예: 모바일의 "+" 메뉴 버튼).
    // 입력창 바깥에 절대(absolute)로 띄우면 화면/카드 높이가 바뀔 때마다 위치가
    // 어긋나는데, 이렇게 입력창과 같은 줄에 두면 항상 입력창 바로 옆에 붙어있어서
    // 어떤 기기·어떤 대화 길이에서도 위치가 흔들리지 않아요.
    leading?: ReactNode;
}

export default function ChatInput({
    onSubmit,
    placeholder = '피부 고민을 입력해주세요.',
    disabled,
    leading,
}: Props) {
    // 입력 중인 텍스트는 이 컴포넌트 안에만 둬요 — 부모(ChatWindow)가 들고 있으면
    // 키 하나 칠 때마다 채팅 메시지 전체가 리렌더돼요.
    const [value, setValue] = useState('');

    return (
        <form
            className="flex items-center gap-2 border-t border-[var(--color-border)] px-4 py-3.5"
            onSubmit={(e) => {
                e.preventDefault();
                const text = value.trim();
                if (!text || disabled) return;
                onSubmit(text);
                setValue('');
            }}>
            {leading}
            <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                maxLength={500}
                className="min-w-0 flex-1 rounded-lg border border-[var(--color-border)] px-3.5 py-2.5 text-[13px] text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] outline-none focus:border-[var(--color-primary)] transition-colors disabled:opacity-60"
            />
            <button
                type="submit"
                disabled={!value.trim() || disabled}
                className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-[13px] font-medium text-white hover:bg-[var(--color-primary-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                전송
                <ArrowRightIcon />
            </button>
        </form>
    );
}
