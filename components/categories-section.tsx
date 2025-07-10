"use client"

import { fetchCategories, type Category } from "@/lib/api/categories"
import { useEffect, useState } from "react"
import CategoryModal from "./category-modal"

export default function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  useEffect(() => {
    fetchCategories().then(setCategories).catch(console.error)
  }, [])

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedCategory(null)
  }

  return (
    <>
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-[#415b58] mb-4">Nos Collections</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat)}
                className="group w-full text-left"
              >
                <div className="relative overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
                  <div className="aspect-[3/2] md:aspect-[4/3] overflow-hidden rounded-xl">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3 md:p-6">
                    <h3 className="text-lg md:text-2xl font-black text-[#415b58] mb-1 md:mb-2">{cat.name}</h3>
                    <p className="text-gray-600 font-normal text-xs md:text-base">&nbsp;</p>
                  </div>
                </div>
              </button>
            ))}

            {/* autres cartes statiques si nécessaire */}
          </div>
        </div>
      </section>

      <CategoryModal isOpen={modalOpen} onClose={closeModal} category={selectedCategory} />
    </>
  )
}
