"use client"

import { useState, useMemo } from "react"
import { useInView } from "react-intersection-observer"
import { motion } from "framer-motion"
import ProductGrid from "./product-grid"
import ProductFilter from "./product-filter"
import EmptyProductState from "./empty-product-state"
import { mockProducts } from "@/lib/mock-products"

interface ProductsSectionProps {
  category: string
  type: string
}

export default function ProductsSection({ category, type }: ProductsSectionProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    brands: [] as string[],
    priceRange: { min: 0, max: 5000 },
    sortBy: "newest",
  })

  // Filter products by category and type
  const categoryProducts = mockProducts.filter((product) => product.category === category && product.type === type)

  // Extract unique brands from filtered products
  const brands = [...new Set(categoryProducts.map((p) => p.brand).filter(Boolean))]

  // Apply additional filters
  const filteredProducts = useMemo(() => {
    const filtered = categoryProducts.filter((product) => {
      // Search filter
      if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }

      // Brand filter
      if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
        return false
      }

      // Price filter
      const price = product.price
      if (price < filters.priceRange.min || price > filters.priceRange.max) {
        return false
      }

      return true
    })

    // Sort products
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "name":
          return a.name.localeCompare(b.name)
        case "brand":
          return a.brand.localeCompare(b.brand)
        case "newest":
        default:
          return b.id - a.id
      }
    })

    return filtered
  }, [categoryProducts, filters, searchTerm])

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductFilter
          onFilterChange={setFilters}
          onSearchChange={setSearchTerm}
          brands={brands}
          totalProducts={categoryProducts.length}
          filteredCount={filteredProducts.length}
        />

        {filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <EmptyProductState
              title="Aucun produit trouvé"
              message="Aucun produit ne correspond à vos critères de recherche. Essayez de modifier les filtres."
              compact={true}
            />
          </motion.div>
        )}
      </div>
    </section>
  )
}
