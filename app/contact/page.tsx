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
        backgroundImage="https://plus.unsplash.com/premium_photo-1677410174588-fe43c63451ef?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />
      <Contact />
      <LocationSection />
      <Footer />
      <WhatsAppButton />
      <CartModal />
    </main>
  )
}
