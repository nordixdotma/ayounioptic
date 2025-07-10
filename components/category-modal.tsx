"use client"

import type { Category } from "@/lib/api/categories"
import { fetchSousCategories, type SousCategory } from "@/lib/api/sousCategories"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  category: Category | null
}

export default function CategoryModal({ isOpen, onClose, category }: CategoryModalProps) {
  if (!category) return null

  const key = category.name.toLowerCase()
  const categoryTitle = category.name

  const [subs, setSubs] = useState<SousCategory[]>([])

  useEffect(() => {
    fetchSousCategories()
      .then((list) => setSubs(list.filter((s) => s.categoryId === category.id)))
      .catch(console.error)
  }, [category])

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 300, damping: 30 },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: { duration: 0.2 },
    },
  }

  const renderOptions = () => {
    if (subs.length > 0) {
      return subs.map((sc) => (
        <Link key={sc.id} href={`/${key}/${sc.name.toLowerCase()}`} className="group" onClick={onClose}>
          <div className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden rounded-xl">
            <div className="aspect-square overflow-hidden rounded-xl">
              <img
                src={sc.image}
                alt={sc.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-2 sm:p-4 text-center">
              <h3 className="text-sm sm:text-lg font-black text-[#415b58] mb-1">{sc.name}</h3>
            </div>
          </div>
        </Link>
      ))
    }

    // Default options for homme/femme
    return (
      <>
        {/* Lunettes de Vue */}
        <Link href={`/${key}/vue`} className="group" onClick={onClose}>
          <div className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden rounded-xl">
            <div className="aspect-square overflow-hidden rounded-xl">
              <img
                src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=300&h=300&fit=crop&crop=center"
                alt="Lunettes de Vue"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-2 sm:p-4 text-center">
              <h3 className="text-sm sm:text-lg font-black text-[#415b58] mb-1">Lunettes de Vue</h3>
              <p className="text-gray-600 font-normal text-xs sm:text-sm">Correction visuelle</p>
            </div>
          </div>
        </Link>

        {/* Lunettes de Soleil */}
        <Link href={`/${key}/soleil`} className="group" onClick={onClose}>
          <div className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden rounded-xl">
            <div className="aspect-square overflow-hidden rounded-xl">
              <img
                src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=300&h=300&fit=crop&crop=center"
                alt="Lunettes de Soleil"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-2 sm:p-4 text-center">
              <h3 className="text-sm sm:text-lg font-black text-[#415b58] mb-1">Lunettes de Soleil</h3>
              <p className="text-gray-600 font-normal text-xs sm:text-sm">Protection solaire</p>
            </div>
          </div>
        </Link>
      </>
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Modal */}
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white w-full max-w-md mx-auto shadow-xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-white/80 hover:bg-white transition-colors"
                aria-label="Fermer"
              >
                <X size={20} className="text-gray-600" />
              </button>

              {/* Modal Content */}
              <div className="p-3 sm:p-6">
                {/* Title */}
                <h2 className="text-xl sm:text-2xl font-black text-[#415b58] text-center mb-4 sm:mb-6">
                  Collection {categoryTitle}
                </h2>

                {/* Options Grid */}
                <div className="grid grid-cols-2 gap-2 sm:gap-4">{renderOptions()}</div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
