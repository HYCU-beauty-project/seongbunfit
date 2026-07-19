import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductsContent from '@/components/ProductsContent';
import { getAllProducts } from '@/lib/products';

export default async function ProductsPage() {
    const products = await getAllProducts();

    return (
        <main className="min-h-screen bg-white">
            <Header />
            <section className="mx-auto max-w-5xl px-6 py-14">
                <ProductsContent products={products} />
            </section>
            <Footer />
        </main>
    );
}
