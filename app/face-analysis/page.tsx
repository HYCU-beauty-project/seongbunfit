import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FaceAnalysisContent from "@/components/FaceAnalysisContent";

export default function FaceAnalysisPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <section className="mx-auto max-w-5xl px-6 py-14">
        <div className="mx-auto max-w-md">
          <FaceAnalysisContent />
        </div>
      </section>
      <Footer />
    </main>
  );
}
