import { redirect } from "next/navigation";

// /mobile/chat 안에 면책 동의 모달 이미 있어서
// 별도 안내 화면 없이 바로 /mobile/chat으로 보냄
export default function MobileChatIntroPage() {
  redirect("/mobile/chat");
}
