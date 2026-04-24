import { WishlistClientPage } from './client';
import { mockProducts, mockCategories } from '@/lib/demo-data';


export default function WishlistPage() {
    const products = mockProducts || [];
    const categories = mockCategories || [];

    return <WishlistClientPage products={products} categories={categories} />;
}
