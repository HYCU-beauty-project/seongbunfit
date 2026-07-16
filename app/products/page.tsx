import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductsContent from "@/components/ProductsContent";

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <section className="mx-auto max-w-5xl px-6 py-14">
        <ProductsContent />
      </section>
      <Footer />
    </main>
  );
}
