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
  const validCategories = ["homme", "femme", "eclipse", "lenses"]
  const validTypes = {
    homme: ["vue", "soleil"],
    femme: ["vue", "soleil"],
    eclipse: ["eclipse"],
    lenses: ["transparent", "colored"],
  }

  if (!validCategories.includes(category) || !validTypes[category as keyof typeof validTypes]?.includes(type)) {
    notFound()
  }

  // Generate titles based on category and type
  const getCategoryTitle = (cat: string) => {
    switch (cat) {
      case "homme":
        return "Homme"
      case "femme":
        return "Femme"
      case "eclipse":
        return "Eclipse"
      case "lenses":
        return "Lentilles"
      default:
        return ""
    }
  }

  const getTypeTitle = (cat: string, typ: string) => {
    if (cat === "eclipse") return "Lunettes Eclipse"
    if (cat === "lenses") {
      return typ === "transparent" ? "Lentilles Transparentes" : "Lentilles Colorées"
    }
    return typ === "vue" ? "Lunettes de Vue" : "Lunettes de Soleil"
  }

  const getSubtitle = (cat: string, typ: string) => {
    if (cat === "eclipse") return "Protection spécialisée pour l'observation solaire"
    if (cat === "lenses") {
      return typ === "transparent"
        ? "Lentilles de contact pour une vision naturelle"
        : "Lentilles colorées pour changer votre look"
    }
    return `Découvrez notre collection de ${getTypeTitle(cat, typ).toLowerCase()} pour ${cat}`
  }

  const getBackgroundImage = (cat: string, typ: string) => {
    if (cat === "eclipse") {
      return "https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=1200&h=600&fit=crop&crop=center"
    }
    if (cat === "lenses") {
      return typ === "transparent"
        ? "https://images.unsplash.com/photo-1582142306909-195724d33c9f?w=1200&h=600&fit=crop&crop=center"
        : "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1200&h=600&fit=crop&crop=center"
    }
    return typ === "vue"
      ? "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=1200&h=600&fit=crop&crop=center"
      : "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1200&h=600&fit=crop&crop=center"
  }

  const categoryTitle = getCategoryTitle(category)
  const typeTitle = getTypeTitle(category, type)
  const pageTitle = category === "eclipse" ? typeTitle : `${typeTitle} ${categoryTitle}`

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <PageHero
        title={pageTitle}
        subtitle={getSubtitle(category, type)}
        backgroundImage={getBackgroundImage(category, type)}
      />
      <ProductsSection category={category} type={type} />
      <Footer />
      <WhatsAppButton />
      <CartModal />
    </main>
  )
}
