import Image from 'next/image';
import Link from 'next/link';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import StepIcon from '@/components/StepIcon';
import CountUp from '@/components/CountUp';
import TypewriterHeading from '@/components/TypewriterHeading';
import ConcernIcon from '@/components/ConcernIcon';
import IngredientConverge from '@/components/IngredientConverge';
import MeshGradientBg from '@/components/MeshGradientBg';
import IconMarquee from '@/components/IconMarquee';
import ScoreDonut from '@/components/ScoreDonut';
import InteractiveScoreDemo from '@/components/InteractiveScoreDemo';
import ArrowRightIcon from '@/components/ArrowRightIcon';

const steps = [
    { number: '1', icon: 'chat', title: '고민 입력', desc: '피부 고민을 입력하거나 선택해 분석을 시작합니다.' },
    { number: '2', icon: 'search', title: '성분 추천', desc: '입력한 고민에 맞는 핵심 성분을 추천드립니다.' },
    { number: '3', icon: 'budget', title: '예산 설정', desc: '원하는 예산을 선택해 추천 범위를 설정합니다.' },
    { number: '4', icon: 'cosmetic', title: 'TOP3 결과', desc: '가성비를 분석해 맞춤 제품 TOP3를 추천합니다.' },
];

const concerns = [
    { icon: 'wrinkle', label: '주름·탄력' },
    { icon: 'brightening', label: '미백·잡티' },
    { icon: 'hydration', label: '수분·건조' },
    { icon: 'pore', label: '모공·트러블' },
    { icon: 'texture', label: '피부결·광채' },
];

const goodPoints = ['전성분 위치 기준', '용량 대비 가격 비교', '가성비 점수 산출', 'AI 맞춤 추천'];
const badPoints = ['광고성 리뷰 중심', '가격 비교 불명확', '성분 설명 부족', '성분 분석 기능 없음'];

export default function MobileHomePage() {
    return (
        <main>
            {/* Hero — 메인 보라색 배경 + 흰 글자 (웹과 통일) */}
            <section className="relative -mt-[65px] overflow-hidden bg-[var(--color-primary)] px-5 pb-10 pt-[95px]">
                <MeshGradientBg variant="hero-dark" />

                <div className="pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-luminosity">
                    <Image
                        src="/images/hero-serum.jpg"
                        alt=""
                        fill
                        priority
                        sizes="100vw"
                        quality={45}
                        className="scale-125 object-cover object-center blur-[2px] brightness-[0.6]"
                        aria-hidden
                    />
                </div>
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-primary-hover)]/20 to-[var(--color-primary-hover)]/55"
                />

                <div className="relative">
                    <h1 className="mt-3 break-keep text-[32px] font-extrabold leading-[1.2] text-white">
                        <TypewriterHeading
                            lines={[
                                { text: '비슷한 성분 구성,' },
                                {
                                    segments: [
                                        { text: '비싼 가격', className: 'text-emphasis-soft' },
                                        { text: '일 필요 없어요' },
                                    ],
                                },
                            ]}
                            speed={35}
                        />
                    </h1>
                    <AnimateOnScroll delay={120}>
                        <p className="mt-3.5 text-[14.5px] text-white/75 leading-relaxed">
                            전성분 배치 순서와 가격을 함께 분석해 가격 대비 합리적인 화장품을 찾아드려요
                        </p>
                        <Link
                            href="/mobile/chat"
                            className="mt-7 flex items-center justify-center gap-1.5 rounded-xl bg-white py-4 text-[15px] font-semibold text-[var(--color-primary)] active:scale-[0.98] transition-all">
                            AI 추천 시작
                            <ArrowRightIcon />
                        </Link>
                    </AnimateOnScroll>
                </div>

                <div className="relative mt-8">
                    <IconMarquee rows={1} />
                </div>

                <svg
                    aria-hidden
                    viewBox="0 0 480 40"
                    preserveAspectRatio="none"
                    className="absolute bottom-0 left-0 h-[28px] w-full text-white">
                    <path d="M0 40 C 120 0, 360 0, 480 40 L480 40 L0 40 Z" fill="currentColor" />
                </svg>
            </section>

            {/* 성분핏이 해결하는 고민 */}
            <section className="mt-12 px-5">
                <AnimateOnScroll>
                    <h2 className="text-center text-[17px] font-bold text-[var(--color-ink)]">
                        이런 고민, 성분핏이 도와드려요
                    </h2>
                </AnimateOnScroll>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                    {concerns.map((concern, idx) => (
                        <AnimateOnScroll
                            key={concern.label}
                            delay={idx * 80}
                            variant="scale"
                            className="w-[calc((100%-24px)/3)]">
                            <Link
                                href={`/mobile/chat?concern=${concern.icon}`}
                                className="flex flex-col items-center gap-2 rounded-xl border border-[var(--color-border)] px-2 py-4 text-center transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:-translate-y-[4px] active:shadow-md active:border-[var(--color-primary)]/40">
                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                                    <ConcernIcon name={concern.icon} size={17} />
                                </span>
                                <p className="text-[11px] font-semibold leading-tight text-[var(--color-ink)]">
                                    {concern.label}
                                </p>
                            </Link>
                        </AnimateOnScroll>
                    ))}
                </div>
            </section>

            {/* 서비스 한눈에 보기 — 2x2, 원 배경 없이 아이콘 크게 */}
            <section className="mt-12 px-5">
                <AnimateOnScroll>
                    <h2 className="text-center text-[19px] font-bold text-[var(--color-ink)]">서비스 한눈에 보기</h2>
                </AnimateOnScroll>
                <div className="mt-7 grid grid-cols-2 gap-8">
                    {steps.map((step, idx) => (
                        <AnimateOnScroll key={step.number} delay={idx * 100} variant="scale">
                            <Link href="/mobile/chat" className="group flex flex-col items-center text-center gap-2.5">
                                <span className="text-[19px] font-extrabold leading-none text-[var(--color-primary)]">
                                    {step.number}
                                </span>
                                <span className="flex h-12 w-12 items-center justify-center rounded-full transition-colors duration-200 active:bg-[var(--color-primary-soft)]">
                                    <span className="transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-125">
                                        <StepIcon name={step.icon} size={40} />
                                    </span>
                                </span>
                                <div>
                                    <p className="text-[12.5px] font-semibold text-[var(--color-ink)]">{step.title}</p>
                                    <p className="mt-1 text-[10.5px] leading-relaxed text-[var(--color-ink-faint)]">
                                        {step.desc}
                                    </p>
                                </div>
                            </Link>
                        </AnimateOnScroll>
                    ))}
                </div>
            </section>

            {/* 비교 섹션 */}
            <section className="mt-10 bg-[var(--color-primary-soft)]/50 px-5 py-9">
                <AnimateOnScroll>
                    <h2 className="text-[19px] font-bold leading-snug text-[var(--color-ink)]">
                        광고성 리뷰 말고
                        <br />
                        <span className="text-[var(--color-primary)]">데이터로</span> 비교하세요
                    </h2>
                </AnimateOnScroll>
                <div className="mt-5 grid grid-cols-2 gap-2.5">
                    <AnimateOnScroll delay={100}>
                        <div className="rounded-xl bg-[var(--color-primary)] p-4 text-white">
                            <p className="text-[12px] font-semibold">성분핏</p>
                            <ul className="mt-2.5 space-y-1.5">
                                {goodPoints.map((p) => (
                                    <li key={p} className="flex items-start gap-1.5 text-[10.5px] leading-snug">
                                        <span aria-hidden>✓</span>
                                        {p}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </AnimateOnScroll>
                    <AnimateOnScroll delay={200}>
                        <div className="rounded-xl bg-white border border-[var(--color-border)] p-4">
                            <p className="text-[12px] font-semibold text-[var(--color-ink-faint)]">타사</p>
                            <ul className="mt-2.5 space-y-1.5">
                                {badPoints.map((p) => (
                                    <li
                                        key={p}
                                        className="flex items-start gap-1.5 text-[10.5px] leading-snug text-[var(--color-ink-faint)]">
                                        <span aria-hidden>✕</span>
                                        {p}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </AnimateOnScroll>
                </div>
            </section>

            {/* 가성비 산출 방식 */}
            <section className="px-5 py-10 text-center">
                <AnimateOnScroll>
                    <h2 className="text-[17px] font-bold text-[var(--color-ink)]">가성비, 이렇게 계산해요</h2>
                </AnimateOnScroll>
                <div className="mt-6 flex flex-col items-center gap-5">
                    <AnimateOnScroll variant="scale" delay={100}>
                        <IngredientConverge>
                            <ScoreDonut size={128} />
                        </IngredientConverge>
                    </AnimateOnScroll>
                    <ul className="w-full max-w-[220px] space-y-2 text-left">
                        {[
                            { color: '#534ab7', label: '전성분 배치 점수', pct: 60 },
                            { color: '#a99ce0', label: '용량 대비 가격 점수', pct: 30 },
                            { color: '#e6e2f7', label: '예산 적합 점수', pct: 10 },
                        ].map((row, idx) => (
                            <AnimateOnScroll key={row.label} delay={250 + idx * 100}>
                                <LegendRow color={row.color} label={row.label} pct={row.pct} />
                            </AnimateOnScroll>
                        ))}
                    </ul>
                </div>
                <p className="mt-5 text-[10.5px] text-[var(--color-ink-faint)]">
                    베이스 성분(정제수, 글리세린 등) 포함, 전체 전성분 순위 기준
                </p>

                <AnimateOnScroll delay={600}>
                    <InteractiveScoreDemo />
                </AnimateOnScroll>
            </section>

            {/* 얼굴 피부 진단 티저 */}
            <section className="border-t border-[var(--color-border)] px-5 py-9">
                <AnimateOnScroll>
                    <div className="flex flex-col items-center text-center gap-4">
                        <Link
                            href="/mobile/face-analysis"
                            className="group relative flex h-20 w-20 shrink-0 items-center justify-center">
                            <span
                                aria-hidden
                                className="animate-ping-slow absolute inset-0 rounded-full bg-[var(--color-primary-soft)]"
                            />
                            <span
                                aria-hidden
                                className="animate-ping-slow-delayed absolute inset-0 rounded-full bg-[var(--color-primary-soft)]"
                            />
                            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-primary-soft)] transition-transform active:scale-95">
                                <svg
                                    width="34"
                                    height="34"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.6"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-[var(--color-primary)]">
                                    <path d="M4 8V6a2 2 0 0 1 2-2h2M4 16v2a2 2 0 0 0 2 2h2M20 8V6a2 2 0 0 0-2-2h-2M20 16v2a2 2 0 0 1-2 2h-2" />
                                    <circle cx="12" cy="12" r="3.2" />
                                </svg>
                            </div>
                        </Link>
                        <div>
                            <span className="inline-block rounded-full bg-gray-100 px-2.5 py-1 text-[10.5px] font-medium text-[var(--color-ink-faint)]">
                                개발 중 · 곧 만나요
                            </span>
                            <h2 className="mt-2.5 text-[17px] font-bold text-[var(--color-ink)]">
                                카메라로 찍기만 하면, AI가 피부를 진단해드려요
                            </h2>
                            <p className="mt-2 text-[12px] text-[var(--color-ink-soft)] leading-relaxed">
                                촬영 환경에 따라 결과가 달라질 수 있어 참고용으로만 활용해주세요. 모바일에서는 카메라
                                권한이 필요해요.
                            </p>
                            <Link
                                href="/mobile/face-analysis"
                                className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-[var(--color-primary)] hover:underline">
                                자세히 보기
                                <ArrowRightIcon />
                            </Link>
                        </div>
                    </div>
                </AnimateOnScroll>
            </section>

            {/* 로드맵 */}
            <section className="border-t border-[var(--color-border)] bg-[var(--color-primary-soft)]/40 px-5 py-10">
                <AnimateOnScroll>
                    <h2 className="text-center text-[18px] font-bold text-[var(--color-ink)]">
                        성분핏이 만들어갈 다음
                    </h2>
                    <p className="mt-1.5 text-center text-[11.5px] text-[var(--color-ink-faint)]">
                        지금은 시작이에요. 이렇게 넓혀갈 예정이에요.
                    </p>
                </AnimateOnScroll>

                <div className="mt-7 space-y-3">
                    {[
                        {
                            badge: '지금',
                            title: 'AI 성분 추천',
                            items: ['AI 채팅 상담', '가성비 지수 계산', '화장품 데이터 검색'],
                        },
                        {
                            badge: '다음',
                            title: '더 정확하게, 더 가깝게',
                            items: [
                                '얼굴 피부 진단(안면인식)',
                                '화장품 카테고리 확장(크림·토너 등)',
                                '주요 이커머스 플랫폼 구매 연동 API 도입',
                                '오픈 기념 이벤트',
                            ],
                        },
                        {
                            badge: '이후',
                            title: '함께 성장하기',
                            items: ['로그인 · 상담 내역 저장', '프리미엄 멤버십 구독', '브랜드 제휴·데이터 리포트'],
                        },
                    ].map((phase, idx) => (
                        <AnimateOnScroll key={phase.badge} delay={idx * 100}>
                            <div className="rounded-2xl bg-white p-5 shadow-sm">
                                <span className="inline-block rounded-full bg-[var(--color-primary-soft)] px-2.5 py-1 text-[10.5px] font-semibold text-[var(--color-primary)]">
                                    {phase.badge}
                                </span>
                                <p className="mt-2.5 text-[14px] font-bold text-[var(--color-ink)]">{phase.title}</p>
                                <ul className="mt-2 space-y-1.5">
                                    {phase.items.map((item) => (
                                        <li
                                            key={item}
                                            className="flex items-start gap-1.5 text-[11.5px] text-[var(--color-ink-soft)]">
                                            <span aria-hidden className="mt-0.5 text-[var(--color-primary)]">
                                                ·
                                            </span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </AnimateOnScroll>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <AnimateOnScroll className="mx-5 mb-10 mt-10">
                <section className="rounded-2xl bg-[var(--color-primary)] px-6 py-8 text-center">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-medium text-white">
                        <span className="flex gap-0.5">
                            <span className="dot h-1 w-1 rounded-full bg-white" style={{ animationDelay: '0ms' }} />
                            <span className="dot h-1 w-1 rounded-full bg-white" style={{ animationDelay: '150ms' }} />
                            <span className="dot h-1 w-1 rounded-full bg-white" style={{ animationDelay: '300ms' }} />
                        </span>
                        AI가 지금도 분석하고 있어요
                    </span>
                    <p className="mt-2.5 text-[15px] font-semibold leading-snug text-white">
                        지금 내 피부 고민에 맞는
                        <br />
                        화장품을 찾아보세요
                    </p>
                    <Link
                        href="/mobile/chat"
                        className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-white px-5 py-2.5 text-[13px] font-semibold text-[var(--color-primary)] shadow-lg active:scale-[0.98] transition-all">
                        AI 추천 시작
                        <ArrowRightIcon />
                    </Link>
                </section>
            </AnimateOnScroll>

            {/* Footer */}
            <footer className="border-t border-[var(--color-border)] px-5 py-8 text-center">
                <p className="text-[13px] font-semibold text-[var(--color-ink)]">성분핏</p>
                <p className="mt-2 text-[11px] text-[var(--color-ink-faint)] leading-relaxed">
                    성분핏 프로젝트팀
                    <br />
                    서울특별시 성동구
                    <br />
                    이메일: help@seongbunfit.com
                </p>
                <p className="mt-3 text-[10px] text-[var(--color-ink-faint)]">
                    COPYRIGHT © HYCU AI PLAYGROUND
                    <br />
                    ALL RIGHTS RESERVED.
                </p>
            </footer>
        </main>
    );
}

function LegendRow({ color, label, pct }: { color: string; label: string; pct: number }) {
    return (
        <li className="flex items-center gap-2 text-[12px]">
            <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[var(--color-ink)]">{label}</span>
            <span className="ml-auto font-semibold text-[var(--color-primary)]">
                <CountUp to={pct} suffix="%" />
            </span>
        </li>
    );
}
