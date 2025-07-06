import Header from "@/components/header"
import Footer from "@/components/footer"
import Contact from "@/components/contact"
import WhatsAppButton from "@/components/whatsapp-button"
import PageHero from "@/components/page-hero"
import LocationSection from "@/components/location-section"
import CartModal from "@/components/cart-modal"

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <PageHero
        title="Contactez-Nous"
        subtitle="Nous serions ravis de vous entendre"
        backgroundImage="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop&crop=center"
      />
      <Contact />
      <LocationSection />
      <Footer />
      <WhatsAppButton />
      <CartModal />
    </main>
  )
}
