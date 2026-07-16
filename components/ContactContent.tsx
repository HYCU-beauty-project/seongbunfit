"use client";

import { useState } from "react";

// TODO: 실제 서비스에서는 팀 문의용 이메일이나 별도 폼(예: Google Forms)으로 교체해주세요.
const CONTACT_EMAIL = "help@seongbunfit.com";

const CATEGORIES = ["서비스 이용 문의", "제품/성분 데이터 오류 제보", "제휴/광고 문의", "기타"];

export default function ContactContent({ onCancel }: { onCancel?: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body = [
      `이름: ${name || "(미입력)"}`,
      `회신받을 이메일: ${email || "(미입력)"}`,
      `문의 유형: ${category}`,
      "",
      message,
    ].join("\n");

    const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      `[성분핏 문의] ${category}`
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = href;
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-[var(--color-border)] px-6 py-10 text-center">
        <p className="text-[14px] font-medium text-[var(--color-ink)]">메일 앱이 열렸어요 📮</p>
        <p className="mt-1.5 text-[12.5px] text-[var(--color-ink-faint)] leading-relaxed">
          내용을 확인하고 보내주시면, 확인 후 회신드릴게요. 감사합니다!
        </p>
        <button
          type="button"
          onClick={onCancel ?? (() => setSent(false))}
          className="mt-5 rounded-xl border border-[var(--color-border)] px-5 py-2.5 text-[13px] font-medium text-[var(--color-ink-soft)] hover:bg-gray-50 transition-colors"
        >
          {onCancel ? "닫기" : "다시 작성하기"}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="이름">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름을 입력해주세요"
          className="w-full rounded-lg border border-[var(--color-border)] px-3.5 py-2.5 text-[13px] outline-none focus:border-[var(--color-primary)] transition-colors"
        />
      </Field>
      <Field label="회신받을 이메일">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com"
          className="w-full rounded-lg border border-[var(--color-border)] px-3.5 py-2.5 text-[13px] outline-none focus:border-[var(--color-primary)] transition-colors"
        />
      </Field>
      <Field label="문의 유형">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-lg border border-[var(--color-border)] px-3.5 py-2.5 text-[13px] outline-none focus:border-[var(--color-primary)] transition-colors"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>
      <Field label="문의 내용">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          placeholder="궁금하신 점이나 전달하고 싶은 내용을 자유롭게 적어주세요"
          className="w-full resize-none rounded-lg border border-[var(--color-border)] px-3.5 py-2.5 text-[13px] outline-none focus:border-[var(--color-primary)] transition-colors"
        />
      </Field>
      <div className="flex gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl border border-[var(--color-border)] py-3 text-[13.5px] font-medium text-[var(--color-ink-soft)] hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
        )}
        <button
          type="submit"
          disabled={!message.trim()}
          className="flex-[2] rounded-xl bg-[var(--color-primary)] py-3 text-[13.5px] font-medium text-white hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          문의 보내기
        </button>
      </div>
      <p className="text-center text-[11px] text-[var(--color-ink-faint)]">
        메일 앱이 열리면 내용을 확인하고 보내주세요. 직접 메일 주소로 보내셔도 돼요: {CONTACT_EMAIL}
      </p>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-medium text-[var(--color-ink-soft)]">{label}</span>
      {children}
    </label>
  );
}
