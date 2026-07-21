'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
    compareCount: number;
    favoriteCount: number;
    onOpenCalc: () => void;
    onOpenCompare: () => void;
    onOpenFavorites: () => void;
    onOpenContact: () => void;
}

// 원래 카드/캐러셀 위에 뜨는 플로팅 버튼(FAB)이었는데 결과 카드 길이가
// 대화마다 달라서 absolute로 띄우면 캐러셀 화살표/입력창/메시지 텍스트랑
// 계속 겹쳤음. 헤더 안 "⋯" 버튼으로도 옮겨봤는데 그건 눈에 안 띄어서
// 직관성 떨어짐
//
// 지금은 떠 있는 요소 말고 입력창(ChatInput)과 같은 줄의 일반 레이아웃 요소로
// 만듦 (ChatWindow에서 <ChatInput leading={...} />로 전달). 입력창은 스크롤
// 영역 밖 고정 자리라 대화 길어지든 카드 커지든 버튼 위치 안 흔들림.
// 메뉴는 버튼 위쪽으로 펼쳐져서 화면 아래에 있어도 밖으로 안 잘림
export default function MobileActionFabs({
    compareCount,
    favoriteCount,
    onOpenCalc,
    onOpenCompare,
    onOpenFavorites,
    onOpenContact,
}: Props) {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const badgeCount = compareCount + favoriteCount;

    // 메뉴 바깥 탭하면 닫힘
    useEffect(() => {
        if (!open) return;
        function handleClickOutside(e: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    return (
        <div ref={wrapperRef} className="relative shrink-0">
            {open && (
                <div className="animate-fade-up absolute bottom-[calc(100%_+_8px)] left-0 z-50 w-52 overflow-hidden rounded-xl border border-[var(--color-border)] bg-white shadow-lg">
                    <MenuItem
                        icon="🧮"
                        label="가성비 계산법 보기"
                        onClick={() => {
                            setOpen(false);
                            onOpenCalc();
                        }}
                    />
                    <MenuItem
                        icon="📊"
                        label="비교함"
                        count={compareCount}
                        onClick={() => {
                            setOpen(false);
                            onOpenCompare();
                        }}
                    />
                    <MenuItem
                        icon="⭐"
                        label="즐겨찾기"
                        count={favoriteCount}
                        onClick={() => {
                            setOpen(false);
                            onOpenFavorites();
                        }}
                    />
                    <MenuItem
                        icon="💬"
                        label="문의하기"
                        onClick={() => {
                            setOpen(false);
                            onOpenContact();
                        }}
                    />
                </div>
            )}

            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
                aria-expanded={open}
                className="relative flex h-11 w-11 shrink-0 items-center justify-center text-[var(--color-primary)] transition-transform active:scale-90">
                <PlusIcon open={open} />
                {!open && badgeCount > 0 && (
                    <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full border border-white bg-amber-400 px-1 text-[9px] font-semibold text-white">
                        {badgeCount}
                    </span>
                )}
            </button>
        </div>
    );
}

function MenuItem({
    icon,
    label,
    count,
    onClick,
}: {
    icon: string;
    label: string;
    count?: number;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-left text-[12.5px] text-[var(--color-ink)] hover:bg-gray-50 transition-colors">
            <span className="flex items-center gap-2">
                <span aria-hidden>{icon}</span>
                {label}
            </span>
            {typeof count === 'number' && count > 0 && (
                <span className="rounded-full bg-[var(--color-primary-soft)] px-2 py-0.5 text-[10.5px] font-medium text-[var(--color-primary)]">
                    {count}
                </span>
            )}
        </button>
    );
}

function PlusIcon({ open }: { open: boolean }) {
    return (
        <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
            aria-hidden
            className="transition-transform duration-200"
            style={{ transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}>
            <path d="M12 5v14M5 12h14" />
        </svg>
    );
}
