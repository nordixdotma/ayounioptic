import CartModal from "@/components/cart-modal"
import Footer from "@/components/footer"
import Header from "@/components/header"
import ProductDetail from "@/components/product-detail"
import WhatsAppButton from "@/components/whatsapp-button"
import { fetchCategories } from "@/lib/api/categories"
import type { Product as ApiProduct } from "@/lib/api/products"
import { fetchProduct } from "@/lib/api/products"
import { fetchSousCategory } from "@/lib/api/sousCategories"
import type { Product as FrontProduct } from "@/lib/mock-products"
import { notFound } from "next/navigation"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const productId = Number.parseInt(params.id)

  if (Number.isNaN(productId)) notFound()

  // Fetch product from backend
  let apiProduct: ApiProduct
  try {
    apiProduct = await fetchProduct(productId)
  } catch (err) {
    console.error(err)
    notFound()
  }

  // Fetch related sous-category and category to build slugs/back-link info
  const [sousCategory, categories] = await Promise.all([
    fetchSousCategory(apiProduct.sousCategoryId),
    fetchCategories(),
  ])

  const category = categories.find((c) => c.id === sousCategory.categoryId)

  if (!category) notFound()

  // Map API product to the shape expected by ProductDetail (FrontProduct interface)
  const product: FrontProduct = {
    id: apiProduct.id,
    name: apiProduct.name,
    price: apiProduct.price,
    oldPrice: apiProduct.price, // TODO: get actual old price if backend provides
    image: apiProduct.images?.[0] || "/placeholder.svg",
    images: apiProduct.images?.length ? apiProduct.images : ["/placeholder.svg"],
    category: category.name.toLowerCase() as any,
    type: sousCategory.name.toLowerCase() as any,
    inStock: true, // TODO: backend may expose stock info
    description: apiProduct.description,
    glassType: undefined,
  }

  return (
    <main className="min-h-screen bg-white">
      <Header forceWhite={true} />
      <div className="pt-28 md:pt-32">
        {/* ProductDetail is still a client component expecting the front-end shape */}
        <ProductDetail product={product} />
      </div>
      <Footer />
      <WhatsAppButton />
      <CartModal />
    </main>
  )
}
