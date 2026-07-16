import type { Metadata } from "next";
import MobileHeader from "@/components/mobile/MobileHeader";

export const metadata: Metadata = {
  title: "성분핏 모바일",
};

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-mobile-shell
      className="relative mx-auto w-full min-h-screen max-w-[480px] overflow-x-hidden bg-white [transform:translateZ(0)]"
    >
      <MobileHeader />
      {children}
    </div>
  );
}
