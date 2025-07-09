"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X } from "lucide-react"
import { useRouter } from "next/navigation"

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      onClose()
      setSearchQuery("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Search Overlay */}
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg border-b border-gray-200"
            onKeyDown={handleKeyDown}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="py-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-black text-[#415b58]">Rechercher des lunettes</h2>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 transition-colors"
                    aria-label="Fermer la recherche"
                  >
                    <X size={20} className="text-gray-600" />
                  </button>
                </div>

                {/* Search Form */}
                <form onSubmit={handleSearch} className="flex gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Rechercher par nom, type, description..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#415b58] focus:border-transparent font-normal text-base"
                      autoFocus
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!searchQuery.trim()}
                    className="px-6 py-3 bg-[#415b58] text-white font-black hover:bg-[#5a7d79] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Rechercher
                  </button>
                </form>

                {/* Quick suggestions */}
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2 font-normal">Suggestions populaires:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Lunettes de vue",
                      "Lunettes de soleil",
                      "Lunettes eclipse",
                      "Lentilles",
                      "Aviateur",
                      "Homme",
                      "Femme",
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => {
                          setSearchQuery(suggestion)
                          router.push(`/search?q=${encodeURIComponent(suggestion)}`)
                          onClose()
                          setSearchQuery("")
                        }}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-normal"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
