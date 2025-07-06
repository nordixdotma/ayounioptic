"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Product } from "@/lib/mock-products"
import Link from "next/link"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (product.images.length > 1) {
      setCurrentImageIndex(1)
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setCurrentImageIndex(0)
  }

  return (
    <Link href={`/products/${product.id}`}>
      <motion.div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.02 }}
        className="group relative bg-white shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col overflow-hidden"
      >
        {/* Image container */}
        <div className="relative h-32 sm:h-40 md:h-48 lg:h-56 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              src={product.images[currentImageIndex] || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>
        </div>

        {/* Content container */}
        <div className="p-2 sm:p-3 flex-grow flex flex-col">
          {/* Product name */}
          <h3 className="text-xs sm:text-sm font-black text-[#415b58] mb-1 line-clamp-2">{product.name}</h3>

          {/* Price section */}
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-1">
              <div>
                <p className="text-sm text-gray-400 line-through font-normal">{product.oldPrice} DH</p>
                <p className="text-base sm:text-lg text-[#415b58] font-black">{product.price} DH</p>
              </div>

              {/* Stock indicator */}
              {product.inStock ? (
                <span className="text-[10px] text-green-600 bg-green-50 px-1 py-0.5 font-normal">En stock</span>
              ) : (
                <span className="text-[10px] text-red-600 bg-red-50 px-1 py-0.5 font-normal">Rupture</span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
