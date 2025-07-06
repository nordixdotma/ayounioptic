"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import Link from "next/link"

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  category: "homme" | "femme" | null
}

export default function CategoryModal({ isOpen, onClose, category }: CategoryModalProps) {
  if (!category) return null

  const categoryTitle = category === "homme" ? "Homme" : "Femme"

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
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: { duration: 0.2 },
    },
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
              <div className="p-6">
                {/* Title */}
                <h2 className="text-2xl font-black text-[#415b58] text-center mb-6">Collection {categoryTitle}</h2>

                {/* Options Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Lunettes de Vue */}
                  <Link href={`/${category}/vue`} className="group" onClick={onClose}>
                    <div className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                      <div className="aspect-square overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=300&h=300&fit=crop&crop=center"
                          alt="Lunettes de Vue"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4 text-center">
                        <h3 className="text-lg font-black text-[#415b58] mb-1">Lunettes de Vue</h3>
                        <p className="text-gray-600 font-normal text-sm">Correction visuelle</p>
                      </div>
                    </div>
                  </Link>

                  {/* Lunettes de Soleil */}
                  <Link href={`/${category}/soleil`} className="group" onClick={onClose}>
                    <div className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                      <div className="aspect-square overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=300&h=300&fit=crop&crop=center"
                          alt="Lunettes de Soleil"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4 text-center">
                        <h3 className="text-lg font-black text-[#415b58] mb-1">Lunettes de Soleil</h3>
                        <p className="text-gray-600 font-normal text-sm">Protection solaire</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
