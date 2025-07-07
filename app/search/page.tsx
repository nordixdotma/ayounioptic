"use client"

import { Suspense } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import WhatsAppButton from "@/components/whatsapp-button"
import PageHero from "@/components/page-hero"
import SearchResults from "@/components/search-results"
import CartModal from "@/components/cart-modal"

function SearchPageContent() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <PageHero
        title="Résultats de recherche"
        subtitle="Trouvez les lunettes parfaites parmi notre collection"
        backgroundImage="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=1200&h=600&fit=crop&crop=center"
      />
      <SearchResults />
      <Footer />
      <WhatsAppButton />
      <CartModal />
    </main>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-white">
          <Header />
          <div className="pt-32 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
          <WhatsAppButton />
          <CartModal />
        </main>
      }
    >
      <SearchPageContent />
    </Suspense>
  )
}
