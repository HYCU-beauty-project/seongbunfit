import { redirect } from "next/navigation";

// /mobile/chat 안에 이미 면책 동의 모달이 포함되어 있어서, 이 페이지는
// 별도 안내 화면을 두는 대신 바로 /mobile/chat으로 보내요.
export default function MobileChatIntroPage() {
  redirect("/mobile/chat");
}
