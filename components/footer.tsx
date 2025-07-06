"use client"

import Link from "next/link"
import { Facebook, Instagram } from "lucide-react"
import CategoryModal from "./category-modal"
import { useState } from "react"

export default function Footer() {
  const menuItems = [
    { name: "Accueil", href: "/" },
    { name: "Contact", href: "/contact" },
  ]
  const currentYear = new Date().getFullYear()

  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<"homme" | "femme" | null>(null)

  const handleCategoryClick = (category: "homme" | "femme") => {
    setSelectedCategory(category)
    setCategoryModalOpen(true)
  }

  const closeCategoryModal = () => {
    setCategoryModalOpen(false)
    setSelectedCategory(null)
  }

  return (
    <footer className="bg-[#415b58] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          {/* Brand */}
          <div className="mb-8 md:mb-0">
            <Link href="/" className="inline-block">
              <img
                src="/fulllogowhite.png"
                alt="Ayouni Optic Logo"
                className="h-14 w-auto brightness-0 invert mb-2"
              />
            </Link>
            <p className="mt-2 text-sm text-white/70 max-w-xs">
              Votre spécialiste en optique à Marrakech, alliant qualité et expertise.
            </p>
          </div>

          {/* Navigation */}
          <nav className="mb-8 md:mb-0">
            <ul className="flex flex-wrap gap-x-8 gap-y-4">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-white hover:text-white/80 relative group transition-colors font-black"
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </li>
              ))}
              <li>
                <button
                  onClick={() => handleCategoryClick("homme")}
                  className="text-white hover:text-white/80 relative group transition-colors font-black"
                >
                  Homme
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick("femme")}
                  className="text-white hover:text-white/80 relative group transition-colors font-black"
                >
                  Femme
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                </button>
              </li>
            </ul>
          </nav>

          {/* Social Icons */}
          <div className="flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
              aria-label="Facebook"
            >
              <Facebook size={18} className="text-white" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={18} className="text-white" />
            </a>
          </div>
        </div>

        <div className="border-t border-white/20 mt-10 pt-6 text-center">
          <p className="text-sm text-white/60">© {currentYear} Ayouni Optic. Tous droits réservés.</p>
          <p className="text-sm text-white/60 mt-1">
            <span>Marrakech, Qussaryat Salam, 2ème étage Jamaa el fna</span>
            {" | "}
            <span>06 96 57 01 64 / 06 66 40 73 44</span>
          </p>
        </div>
      </div>
      <CategoryModal isOpen={categoryModalOpen} onClose={closeCategoryModal} category={selectedCategory} />
    </footer>
  )
}
