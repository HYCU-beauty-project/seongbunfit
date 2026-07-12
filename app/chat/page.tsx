<<<<<<< HEAD
// 피부 고민 AI 채팅 화면 + 추천 TOP3 표시
=======
"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Modal from "@/components/ui/Modal";
import ChatWindow from "@/components/chat/ChatWindow";
import { useLocalStorage } from "@/lib/useLocalStorage";

export default function ChatPage() {
  const [agreed, setAgreed, hydrated] = useLocalStorage<boolean>("ingredientfit:agreed", false);
  const [justDeclined, setJustDeclined] = useState(false);

  return (
    <main className="min-h-screen">
      <Header />
      {!hydrated ? null : !agreed ? (
        <div>
          <Modal open={!agreed} onAgree={() => setAgreed(true)} onBack={() => setJustDeclined(true)} />
          {justDeclined && (
            <p className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-[var(--color-ink)] px-4 py-2 text-[12px] text-white shadow-lg animate-fade-up">
              서비스 이용을 위해서는 동의가 필요해요
            </p>
          )}
        </div>
      ) : (
        <ChatWindow />
      )}
    </main>
  );
}
>>>>>>> origin/main
