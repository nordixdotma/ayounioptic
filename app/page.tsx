"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import WhatsAppButton from "@/components/whatsapp-button"
import HeroSection from "@/components/hero-section"
import CategoriesSection from "@/components/categories-section"
import AboutSection from "@/components/about-section"
import BannerSection from "@/components/marquee-banner"
import ServicesSection from "@/components/vos-avantage"
import CartModal from "@/components/cart-modal"
import TestimonialsSection from "@/components/testimonials-section"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      <HeroSection />
      <BannerSection />
      <CategoriesSection />
      <AboutSection />
      <ServicesSection />
      <BannerSection />
      <TestimonialsSection />

      <Footer />
      <WhatsAppButton />
      <CartModal />
    </div>
  )
}
