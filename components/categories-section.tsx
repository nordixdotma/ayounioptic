"use client"

import { useState } from "react"
import CategoryModal from "./category-modal"
import Link from "next/link"

export default function CategoriesSection() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<"homme" | "femme" | "lenses" | null>(null)

  const handleCategoryClick = (category: "homme" | "femme" | "lenses") => {
    setSelectedCategory(category)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedCategory(null)
  }

  return (
    <>
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-[#415b58] mb-4">Nos Collections</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8">
            {/* Homme Card */}
            <button onClick={() => handleCategoryClick("homme")} className="group w-full text-left">
              <div className="relative overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-[3/2] md:aspect-[4/3] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1556306535-38febf6782e7?w=500&h=350&fit=crop&crop=center"
                    alt="Lunettes pour Homme"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 md:p-6">
                  <h3 className="text-lg md:text-2xl font-black text-[#415b58] mb-1 md:mb-2">Homme</h3>
                  <p className="text-gray-600 font-normal text-xs md:text-base">Style et performance</p>
                </div>
              </div>
            </button>

            {/* Femme Card */}
            <button onClick={() => handleCategoryClick("femme")} className="group w-full text-left">
              <div className="relative overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-[3/2] md:aspect-[4/3] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500&h=350&fit=crop&crop=center"
                    alt="Lunettes pour Femme"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 md:p-6">
                  <h3 className="text-lg md:text-2xl font-black text-[#415b58] mb-1 md:mb-2">Femme</h3>
                  <p className="text-gray-600 font-normal text-xs md:text-base">Élégance et modernité</p>
                </div>
              </div>
            </button>

            {/* Eclipse Card - Direct link */}
            <Link href="/eclipse/eclipse" className="group w-full text-left">
              <div className="relative overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-[3/2] md:aspect-[4/3] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=500&h=350&fit=crop&crop=center"
                    alt="Lunettes Eclipse"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 md:p-6">
                  <h3 className="text-lg md:text-2xl font-black text-[#415b58] mb-1 md:mb-2">Eclipse</h3>
                  <p className="text-gray-600 font-normal text-xs md:text-base">Protection spécialisée</p>
                </div>
              </div>
            </Link>

            {/* Lenses Card */}
            <button onClick={() => handleCategoryClick("lenses")} className="group w-full text-left">
              <div className="relative overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-[3/2] md:aspect-[4/3] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1582142306909-195724d33c9f?w=500&h=350&fit=crop&crop=center"
                    alt="Lentilles de Contact"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 md:p-6">
                  <h3 className="text-lg md:text-2xl font-black text-[#415b58] mb-1 md:mb-2">Lentilles</h3>
                  <p className="text-gray-600 font-normal text-xs md:text-base">Confort et liberté</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Category Modal */}
      <CategoryModal isOpen={modalOpen} onClose={closeModal} category={selectedCategory} />
    </>
  )
}
