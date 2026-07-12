import type { Metadata } from "next";
import MobileHeader from "@/components/mobile/MobileHeader";
import MobileTabBar from "@/components/mobile/MobileTabBar";
import "./mobile.css"

export const metadata: Metadata = {
  title: "성분핏 모바일",
};

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto min-h-screen max-w-[480px] bg-white">
      <MobileHeader />
      <div className="pb-[60px]">{children}</div>
      <MobileTabBar />
    </div>
  );
}
