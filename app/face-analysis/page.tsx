import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FaceAnalysisContent from "@/components/FaceAnalysisContent";

export default function FaceAnalysisPage() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Header />
      <section className="mx-auto w-full max-w-5xl flex-1 px-6 py-14">
        <div className="mx-auto max-w-md">
          <FaceAnalysisContent />
        </div>
      </section>
      <Footer />
    </main>
  );
}
