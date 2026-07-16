interface Props {
  onDark?: boolean;
}

export default function FloatingMolecules({ onDark = false }: Props) {
  const color1 = onDark ? "text-white" : "text-[var(--color-primary)]";
  const color2 = onDark ? "text-white" : "text-[var(--color-accent)]";
  const opacity1 = onDark ? "opacity-[0.08]" : "opacity-[0.07]";
  const opacity2 = onDark ? "opacity-[0.06]" : "opacity-[0.06]";

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg
        viewBox="0 0 200 200"
        className={`animate-slow-spin absolute -right-10 top-10 h-52 w-52 ${color1} ${opacity1} md:h-72 md:w-72`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="40" cy="40" r="6" fill="currentColor" stroke="none" />
        <circle cx="140" cy="60" r="9" fill="currentColor" stroke="none" />
        <circle cx="90" cy="130" r="7" fill="currentColor" stroke="none" />
        <circle cx="160" cy="150" r="5" fill="currentColor" stroke="none" />
        <path d="M40 40 90 130M90 130 140 60M140 60 160 150" />
      </svg>

      <svg
        viewBox="0 0 24 24"
        className={`animate-slow-spin-reverse absolute bottom-8 left-8 h-24 w-24 ${color2} ${opacity2} md:h-32 md:w-32`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path d="M12 2.5c3.5 4.5 6 7.8 6 11.2a6 6 0 1 1-12 0c0-3.4 2.5-6.7 6-11.2Z" />
      </svg>
    </div>
  );
}
