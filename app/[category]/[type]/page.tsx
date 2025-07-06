import { notFound } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import WhatsAppButton from "@/components/whatsapp-button"
import PageHero from "@/components/page-hero"
import ProductsSection from "@/components/products-section"
import CartModal from "@/components/cart-modal"

interface CategoryPageProps {
  params: {
    category: string
    type: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { category, type } = params

  // Validate category and type
  const validCategories = ["homme", "femme"]
  const validTypes = ["vue", "soleil"]

  if (!validCategories.includes(category) || !validTypes.includes(type)) {
    notFound()
  }

  const categoryTitle = category === "homme" ? "Homme" : "Femme"
  const typeTitle = type === "vue" ? "Lunettes de Vue" : "Lunettes de Soleil"
  const pageTitle = `${typeTitle} ${categoryTitle}`

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <PageHero
        title={pageTitle}
        subtitle={`Découvrez notre collection de ${typeTitle.toLowerCase()} pour ${category}`}
        backgroundImage={
          type === "vue"
            ? "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=1200&h=600&fit=crop&crop=center"
            : "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1200&h=600&fit=crop&crop=center"
        }
      />
      <ProductsSection category={category} type={type} />
      <Footer />
      <WhatsAppButton />
      <CartModal />
    </main>
  )
}
