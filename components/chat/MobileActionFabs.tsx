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

// ⚠️ 원래는 카드/캐러셀 위에 떠 있는 플로팅 버튼(FAB)이었는데, 결과 카드 길이가
// 대화마다 달라지다 보니 우측 하단에 절대(absolute) 위치로 띄우면 캐러셀
// 화살표·입력창·메시지 텍스트랑 계속 겹쳤어요. 그래서 한 번은 헤더 안의 "⋯"
// 버튼으로 옮겼었는데, 그러니 이번엔 원래 + 버튼만큼 눈에 띄지 않아 직관성이
// 떨어졌어요.
//
// 지금은 이 버튼을 "떠 있는 요소"가 아니라 입력창(ChatInput)과 같은 줄에 놓인
// 일반 레이아웃 요소로 만들었어요(ChatWindow에서 <ChatInput leading={...} />로
// 전달). 입력창은 스크롤 영역 밖에 항상 고정으로 있는 자리라, 대화가 길어지든
// 카드가 커지든 이 버튼 위치는 절대 흔들리지 않아요. 메뉴는 버튼 위로(위쪽 방향)
// 펼쳐지도록 해서, 화면 아래쪽에 있어도 화면 밖으로 잘리지 않아요.
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

    // 메뉴 바깥을 탭하면 닫히게 해요.
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
