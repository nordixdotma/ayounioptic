"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X, ChevronDown, Tag } from "lucide-react"

interface FilterOptions {
  brands: string[]
  priceRange: {
    min: number
    max: number
  }
  sortBy: string
}

interface ProductFilterProps {
  onFilterChange: (filters: FilterOptions) => void
  onSearchChange: (search: string) => void
  brands: string[]
  totalProducts: number
  filteredCount: number
}

type FilterType = "price" | "sort"

interface FilterState {
  price: string
  sort: string
}

interface DropdownState {
  price: boolean
  sort: boolean
}

export default function ProductFilter({
  onFilterChange,
  onSearchChange,
  brands,
  totalProducts,
  filteredCount,
}: ProductFilterProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  // Remove the local searchTerm state since it's now handled by the parent
  // const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<FilterState>({
    price: "Tous les prix",
    sort: "Plus récent",
  })

  const [dropdownOpen, setDropdownOpen] = useState<DropdownState>({
    price: false,
    sort: false,
  })

  const dropdownRefs = {
    price: useRef<HTMLDivElement>(null),
    sort: useRef<HTMLDivElement>(null),
  }

  // Check if any filter is applied
  const hasActiveFilters = filters.price !== "Tous les prix"

  // Get price ranges
  const getPriceRanges = () => [
    "Tous les prix",
    "Moins de 500 DH",
    "500 - 1000 DH",
    "1000 - 2000 DH",
    "2000 - 3000 DH",
    "Plus de 3000 DH",
  ]

  // Get sort options
  const getSortOptions = () => ["Plus récent", "Prix: croissant", "Prix: décroissant", "Nom A-Z", "Marque"]

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 300)

    const handleClickOutside = (event: any) => {
      Object.keys(dropdownRefs).forEach((key) => {
        const ref = dropdownRefs[key as FilterType]
        if (ref.current && !ref.current.contains(event.target)) {
          setDropdownOpen((prev) => ({ ...prev, [key]: false }))
        }
      })
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      clearTimeout(timer)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Update filters when they change
  useEffect(() => {
    const filterOptions: FilterOptions = {
      brands: [],
      priceRange: getPriceRangeFromString(filters.price),
      sortBy: getSortValueFromString(filters.sort),
    }
    onFilterChange(filterOptions)
  }, [filters, onFilterChange])

  useEffect(() => {
    // Removed searchTerm dependency
  }, [onSearchChange])

  const getPriceRangeFromString = (priceString: string) => {
    switch (priceString) {
      case "Moins de 500 DH":
        return { min: 0, max: 500 }
      case "500 - 1000 DH":
        return { min: 500, max: 1000 }
      case "1000 - 2000 DH":
        return { min: 1000, max: 2000 }
      case "2000 - 3000 DH":
        return { min: 2000, max: 3000 }
      case "Plus de 3000 DH":
        return { min: 3000, max: 10000 }
      default:
        return { min: 0, max: 10000 }
    }
  }

  const getSortValueFromString = (sortString: string) => {
    switch (sortString) {
      case "Prix: croissant":
        return "price-low"
      case "Prix: décroissant":
        return "price-high"
      case "Nom A-Z":
        return "name"
      case "Marque":
        return "brand"
      default:
        return "newest"
    }
  }

  const toggleDropdown = (dropdown: FilterType) => {
    setDropdownOpen((prev) => {
      const newState = { ...prev }
      Object.keys(newState).forEach((key) => {
        newState[key as FilterType] = key === dropdown ? !prev[key as FilterType] : false
      })
      return newState
    })
  }

  const setFilter = (type: FilterType, value: string) => {
    setFilters((prev) => ({ ...prev, [type]: value }))
    setDropdownOpen((prev) => ({ ...prev, [type]: false }))
  }

  const resetFilters = () => {
    setFilters({
      price: "Tous les prix",
      sort: "Plus récent",
    })
    // Don't reset search here since it's handled by URL params
  }

  const resetFilter = (type: FilterType) => {
    const defaultValues = {
      price: "Tous les prix",
      sort: "Plus récent",
    }
    setFilters((prev) => ({ ...prev, [type]: defaultValues[type] }))
  }

  return (
    <div
      className={`bg-white shadow-md p-3 md:p-4 mb-4 md:mb-8 transition-all duration-700 transform relative z-30 ${
        isLoaded ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
      }`}
    >
      {/* Search and Reset Filters */}
      <div className="flex gap-3 mb-4 transition-all duration-300 ease-in-out">
        <div className={`relative transition-all duration-500 ease-in-out ${hasActiveFilters ? "w-10/12" : "w-full"}`}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher des lunettes..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#415b58] focus:border-transparent font-normal"
            onChange={(e) => onSearchChange(e.target.value)}
            defaultValue=""
          />
          {/* Remove the X button for clearing search since it's handled by URL params in search page */}
        </div>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="bg-red-500 text-white hover:bg-red-600 font-black text-sm px-4 py-2.5 transition-colors flex items-center justify-center w-2/12 duration-200"
          >
            <X className="w-4 h-4 mr-1.5" />
            <span className="hidden md:inline">Effacer</span>
            <span className="md:hidden">Reset</span>
          </button>
        )}
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600 mb-4 font-normal">
        Affichage de {filteredCount} sur {totalProducts} produits
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Price Filter */}
        <div className="relative" ref={dropdownRefs.price}>
          <button
            onClick={() => toggleDropdown("price")}
            className={`w-full flex items-center justify-between px-3 py-2 border ${
              filters.price !== "Tous les prix" ? "border-[#415b58] bg-[#415b58]/10" : "border-gray-200"
            } text-sm focus:outline-none focus:ring-2 focus:ring-[#415b58] focus:border-transparent transition-colors font-normal`}
          >
            <div className="flex items-center">
              {filters.price !== "Tous les prix" && (
                <div
                  onClick={(e) => {
                    e.stopPropagation()
                    resetFilter("price")
                  }}
                  className="mr-1 text-[#415b58] hover:text-[#5a7d79] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </div>
              )}
              <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen.price ? "rotate-180" : ""}`} />
            </div>
            <div className="flex items-center">
              <span className="truncate text-xs md:text-sm">{filters.price}</span>
              <Tag className="w-4 h-4 ml-2 text-gray-500" />
            </div>
          </button>

          {dropdownOpen.price && (
            <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 shadow-lg">
              {getPriceRanges().map((price) => (
                <button
                  key={price}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 font-normal ${
                    filters.price === price ? "bg-[#415b58]/10 font-black" : ""
                  }`}
                  onClick={() => setFilter("price", price)}
                >
                  {price}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort Filter */}
        <div className="relative" ref={dropdownRefs.sort}>
          <button
            onClick={() => toggleDropdown("sort")}
            className={`w-full flex items-center justify-between px-3 py-2 border ${
              filters.sort !== "Plus récent" ? "border-[#415b58] bg-[#415b58]/10" : "border-gray-200"
            } text-sm focus:outline-none focus:ring-2 focus:ring-[#415b58] focus:border-transparent transition-colors font-normal`}
          >
            <div className="flex items-center">
              {filters.sort !== "Plus récent" && (
                <div
                  onClick={(e) => {
                    e.stopPropagation()
                    resetFilter("sort")
                  }}
                  className="mr-1 text-[#415b58] hover:text-[#5a7d79] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </div>
              )}
              <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen.sort ? "rotate-180" : ""}`} />
            </div>
            <div className="flex items-center">
              <span className="truncate text-xs md:text-sm">{filters.sort}</span>
              <Tag className="w-4 h-4 ml-2 text-gray-500" />
            </div>
          </button>

          {dropdownOpen.sort && (
            <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 shadow-lg">
              {getSortOptions().map((sort) => (
                <button
                  key={sort}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 font-normal ${
                    filters.sort === sort ? "bg-[#415b58]/10 font-black" : ""
                  }`}
                  onClick={() => setFilter("sort", sort)}
                >
                  {sort}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
