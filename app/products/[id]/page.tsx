import { notFound } from "next/navigation"
import { getProductById } from "@/lib/mock-products"
import Header from "@/components/header"
import Footer from "@/components/footer"
import WhatsAppButton from "@/components/whatsapp-button"
import ProductDetail from "@/components/product-detail"
import CartModal from "@/components/cart-modal"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const productId = Number.parseInt(params.id)
  const product = getProductById(productId)

  if (!product) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-white">
      <Header forceWhite={true} />
      <div className="pt-28 md:pt-32">
        <ProductDetail product={product} />
      </div>
      <Footer />
      <WhatsAppButton />
      <CartModal />
    </main>
  )
}
