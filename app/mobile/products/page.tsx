import ProductsContent from '@/components/ProductsContent';
import { getAllProducts } from '@/lib/products';

export default async function MobileProductsPage() {
    const products = await getAllProducts();

    return (
        <main className="px-5 py-8">
            <ProductsContent compact products={products} />
        </main>
    );
}
