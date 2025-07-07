"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { useInView } from "react-intersection-observer"
import { motion } from "framer-motion"
import ProductGrid from "./product-grid"
import ProductFilter from "./product-filter"
import EmptyProductState from "./empty-product-state"
import { mockProducts } from "@/lib/mock-products"

export default function SearchResults() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("q") || ""

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [filters, setFilters] = useState({
    brands: [] as string[],
    priceRange: { min: 0, max: 5000 },
    sortBy: "newest",
  })

  // Search and filter products
  const filteredProducts = useMemo(() => {
    let filtered = mockProducts

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter((product) => {
        const query = searchQuery.toLowerCase()
        return (
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.type.toLowerCase().includes(query) ||
          (product.type === "vue" && "lunettes de vue".includes(query)) ||
          (product.type === "soleil" && "lunettes de soleil".includes(query)) ||
          (product.category === "homme" && "homme".includes(query)) ||
          (product.category === "femme" && "femme".includes(query)) ||
          (product.description && product.description.toLowerCase().includes(query))
        )
      })
    }

    // Apply price filter
    const price = (product: any) => product.price
    filtered = filtered.filter((product) => {
      const productPrice = price(product)
      return productPrice >= filters.priceRange.min && productPrice <= filters.priceRange.max
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
        case "newest":
        default:
          return b.id - a.id
      }
    })

    return filtered
  }, [searchQuery, filters])

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Query Display */}
        {searchQuery && (
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-black text-[#415b58] mb-2">Résultats pour "{searchQuery}"</h1>
            <p className="text-gray-600 font-normal">
              {filteredProducts.length} produit{filteredProducts.length !== 1 ? "s" : ""} trouvé
              {filteredProducts.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}

        {/* Filters */}
        <ProductFilter
          onFilterChange={setFilters}
          onSearchChange={() => {}} // Search is handled by URL params
          brands={[]} // No brands anymore
          totalProducts={mockProducts.length}
          filteredCount={filteredProducts.length}
        />

        {/* Results */}
        {filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} />
        ) : (
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <EmptyProductState
              title={searchQuery ? `Aucun résultat pour "${searchQuery}"` : "Aucun produit trouvé"}
              message={
                searchQuery
                  ? "Essayez de modifier votre recherche ou utilisez des termes plus généraux."
                  : "Aucun produit ne correspond à vos critères de recherche."
              }
              compact={true}
            />
          </motion.div>
        )}
      </div>
    </section>
  )
}
