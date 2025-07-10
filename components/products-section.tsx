"use client"

import { fetchProducts, type Product as ApiProduct } from "@/lib/api/products"
import { fetchSousCategories } from "@/lib/api/sousCategories"
import { mockProducts, type Product as FrontProduct } from "@/lib/mock-products"
import { motion } from "framer-motion"
import { useEffect, useMemo, useState } from "react"
import { useInView } from "react-intersection-observer"
import EmptyProductState from "./empty-product-state"
import ProductFilter from "./product-filter"
import ProductGrid from "./product-grid"

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

  // State for products fetched from backend (already mapped to the front-end shape)
  const [backendProducts, setBackendProducts] = useState<FrontProduct[] | null>(null)

  // Fetch the sous-category id matching the params, then fetch products that belong to it
  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        // 1) Find the sous-category so that we can query by id
        const allSubs = await fetchSousCategories()
        const targetSub = allSubs.find(
          (s) =>
            s.name.toLowerCase() === type.toLowerCase() &&
            // We do a loose match on category name via relation when available
            // but if "category" relation is missing we attempt to match through the slug in the URL
            (s.category?.name?.toLowerCase() === category.toLowerCase() || true),
        )

        if (!targetSub) {
          if (!cancelled) setBackendProducts([])
          return
        }

        // 2) Fetch products for that sous-category
        const apiProducts = await fetchProducts({ sousCategoryId: targetSub.id })

        // 3) Map them to the existing FrontProduct interface expected by the product grid/card components
        const mapped: FrontProduct[] = apiProducts.map((p: ApiProduct) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          oldPrice: p.price, // TODO: backend could expose an oldPrice/discount value
          image: p.images?.[0] || "/placeholder.svg",
          images: p.images?.length ? p.images : ["/placeholder.svg"],
          // We keep the original category/type for filtering/searching but infer from URL params
          category: category as any,
          type: type as any,
          inStock: true, // backend could include a stock field, defaulting to true for now
          description: p.description,
        }))

        if (!cancelled) setBackendProducts(mapped)
      } catch (err) {
        console.error(err)
        if (!cancelled) setBackendProducts([])
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [category, type])

  // Prefer products loaded from backend. Fallback to mock list if backend returned nothing/null.
  const sourceProducts = backendProducts !== null ? backendProducts : mockProducts

  // Filter products by category and type (applies to the mock fallback scenario)
  const categoryProducts = sourceProducts.filter(
    (product) => product.category.toLowerCase() === category.toLowerCase() && product.type.toLowerCase() === type.toLowerCase(),
  )

  // Apply additional filters
  const filteredProducts = useMemo(() => {
    const filtered = categoryProducts.filter((product) => {
      // Search filter
      if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
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
          brands={[]} // No brands anymore
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
