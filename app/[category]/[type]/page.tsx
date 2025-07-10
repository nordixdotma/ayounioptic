import CartModal from "@/components/cart-modal"
import Footer from "@/components/footer"
import Header from "@/components/header"
import PageHero from "@/components/page-hero"
import ProductsSection from "@/components/products-section"
import WhatsAppButton from "@/components/whatsapp-button"
import { fetchCategories } from "@/lib/api/categories"
import { fetchSousCategories } from "@/lib/api/sousCategories"
import { notFound } from "next/navigation"

interface CategoryPageProps {
  params: {
    category: string
    type: string
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug, type: sousSlug } = params

  // Fetch data from backend
  const [categories, sousCategories] = await Promise.all([fetchCategories(), fetchSousCategories()])

  // Find matching category and sous-category (case-insensitive)
  const category = categories.find((c) => c.name.toLowerCase() === decodeURIComponent(categorySlug).toLowerCase())
  if (!category) notFound()

  const sousCategory = sousCategories.find(
    (s) =>
      s.categoryId === category.id &&
      s.name.toLowerCase() === decodeURIComponent(sousSlug).toLowerCase(),
  )

  if (!sousCategory) notFound()

  // Derive some simple titles – can be improved later with dedicated fields
  const pageTitle = `${sousCategory.name} ${category.name}`
  const subtitle = `Découvrez notre collection ${sousCategory.name.toLowerCase()} de la catégorie ${category.name}`

  // Placeholder background image – we could use category.image but ensure good resolution
  const backgroundImage = category.image || "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=1200&h=600&fit=crop&crop=center"

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <PageHero title={pageTitle} subtitle={subtitle} backgroundImage={backgroundImage} />
      {/* Pass slug values, ProductsSection will fetch products based on them */}
      <ProductsSection category={categorySlug} type={sousSlug} />
      <Footer />
      <WhatsAppButton />
      <CartModal />
    </main>
  )
}
