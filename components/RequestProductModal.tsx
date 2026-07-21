"use client";

import { useState } from "react";

// TODO: 실서비스에선 팀 문의용 이메일이나 별도 폼(Google Forms 등)으로 교체해야 함
const REQUEST_EMAIL = "rkaakths0101@naver.com";

interface Props {
  open: boolean;
  initialName?: string;
  onClose: () => void;
}

export default function RequestProductModal({ open, initialName = "", onClose }: Props) {
  const [name, setName] = useState(initialName);
  const [brand, setBrand] = useState("");
  const [link, setLink] = useState("");
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body = [
      "안녕하세요, 성분핏에 아래 제품을 추가해주세요!",
      "",
      `제품명: ${name || "(미입력)"}`,
      `브랜드: ${brand || "(미입력)"}`,
      `구매처 링크: ${link || "(미입력)"}`,
      note ? `요청사항: ${note}` : "",
      "",
      "감사합니다.",
    ]
      .filter(Boolean)
      .join("\n");

    const href = `mailto:${REQUEST_EMAIL}?subject=${encodeURIComponent(
      "[성분핏] 제품 추가 요청"
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = href;
    setSent(true);
  }

  function handleClose() {
    setSent(false);
    setName("");
    setBrand("");
    setLink("");
    setNote("");
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-4 py-8"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-up w-full max-w-md rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
          <h2 className="text-[15px] font-semibold text-[var(--color-ink)]">제품 추가 요청하기</h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label="닫기"
            className="text-[18px] leading-none text-[var(--color-ink-faint)] hover:text-[var(--color-ink)] transition-colors"
          >
            ✕
          </button>
        </div>

        {sent ? (
          <div className="px-6 py-8 text-center">
            <p className="text-[14px] font-medium text-[var(--color-ink)]">메일 앱이 열렸어요 📮</p>
            <p className="mt-1.5 text-[12.5px] text-[var(--color-ink-faint)]">
              메일을 보내주시면 확인 후 DB에 추가해드릴게요. 감사합니다!
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-5 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-[13px] font-medium text-white hover:bg-[var(--color-primary-hover)] transition-colors"
            >
              닫기
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 px-6 py-5">
            <p className="text-[12px] text-[var(--color-ink-faint)]">
              아래 내용을 적어주시면 메일 앱이 열려요. 보내주시면 확인 후 추가해드릴게요.
            </p>
            <Field label="제품명">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 리제너 나이트 세럼"
                className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-[13px] outline-none focus:border-[var(--color-primary)] transition-colors"
              />
            </Field>
            <Field label="브랜드">
              <input
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="예: 셀루틴"
                className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-[13px] outline-none focus:border-[var(--color-primary)] transition-colors"
              />
            </Field>
            <Field label="구매처 링크 (선택)">
              <input
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-[13px] outline-none focus:border-[var(--color-primary)] transition-colors"
              />
            </Field>
            <Field label="요청사항 (선택)">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="추가로 전달하고 싶은 내용이 있다면 적어주세요"
                className="w-full resize-none rounded-lg border border-[var(--color-border)] px-3 py-2 text-[13px] outline-none focus:border-[var(--color-primary)] transition-colors"
              />
            </Field>
            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full rounded-xl bg-[var(--color-primary)] py-2.5 text-[13px] font-medium text-white hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              메일로 요청 보내기
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11.5px] font-medium text-[var(--color-ink-soft)]">{label}</span>
      {children}
    </label>
  );
}
