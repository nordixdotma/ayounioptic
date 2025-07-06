"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import WhatsAppButton from "@/components/whatsapp-button"
import HeroSection from "@/components/hero-section"
import CategoriesSection from "@/components/categories-section"
import AboutSection from "@/components/about-section"
import CartModal from "@/components/cart-modal"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      <HeroSection />
      <CategoriesSection />
      <AboutSection />

      <Footer />
      <WhatsAppButton />
      <CartModal />
    </div>
  )
}
