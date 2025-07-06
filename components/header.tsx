"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Menu, X, ShoppingBag, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import CategoryModal from "./category-modal"
import { useCart } from "@/lib/cart-context"

interface HeaderProps {
  forceWhite?: boolean
}

export default function Header({ forceWhite = false }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(forceWhite)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [windowHeight, setWindowHeight] = useState(0)
  const headerRef = useRef<HTMLElement>(null)
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<"homme" | "femme" | null>(null)
  const { totalItems, openCart } = useCart()

  // Update window height on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      setWindowHeight(window.innerHeight)
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  // Scroll locking for mobile menu
  useEffect(() => {
    if (isMenuOpen) {
      const scrollY = window.scrollY
      document.body.style.position = "fixed"
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = "100%"
    } else {
      const scrollY = document.body.style.top
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.width = ""
      if (scrollY) {
        window.scrollTo(0, Number.parseInt(scrollY || "0", 10) * -1)
      }
    }

    return () => {
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.width = ""
    }
  }, [isMenuOpen])

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(forceWhite || window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [forceWhite])

  // Close menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const menuVariants = {
    closed: { x: "-100%", opacity: 0 },
    open: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    exit: {
      x: "-100%",
      opacity: 0,
      transition: { ease: "easeInOut", duration: 0.3 },
    },
  }

  const menuItemVariants = {
    closed: { x: 20, opacity: 0 },
    open: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  }

  const menuItems = [
    { name: "Accueil", href: "/" },
    { name: "Contact", href: "/contact" },
  ]

  const handleCategoryClick = (category: "homme" | "femme") => {
    setSelectedCategory(category)
    setCategoryModalOpen(true)
  }

  const closeCategoryModal = () => {
    setCategoryModalOpen(false)
    setSelectedCategory(null)
  }

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out",
          isScrolled ? "bg-white/95 backdrop-blur-md shadow-md py-3" : "bg-transparent py-5 md:py-6",
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Left Side - Menu + Logo */}
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button - Left */}
              <div className="md:hidden">
                <button
                  className={cn(
                    "p-2 transition-colors",
                    isScrolled ? "text-[#415b58] hover:bg-[#415b58]/10" : "text-white hover:bg-white/10",
                  )}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label="Menu"
                >
                  <Menu size={24} />
                </button>
              </div>

              {/* Logo */}
              <Link href="/" className="flex items-center">
                <img
                  src={
                    isScrolled
                      ? "/logoblack.png"
                      : "/whitelogo.png"
                  }
                  alt="Ayouni Optic Logo"
                  className="h-10 md:h-12 w-auto transition-opacity duration-300"
                />
              </Link>
            </div>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden md:flex items-center space-x-8 flex-1 justify-center">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-base relative group transition-colors font-black",
                    isScrolled ? "text-[#415b58] hover:text-[#5a7d79]" : "text-white hover:text-white/80",
                  )}
                >
                  {item.name}
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300",
                      isScrolled ? "bg-[#415b58]" : "bg-white",
                    )}
                  />
                </Link>
              ))}
              <button
                onClick={() => handleCategoryClick("homme")}
                className={cn(
                  "text-base relative group transition-colors font-black",
                  isScrolled ? "text-[#415b58] hover:text-[#5a7d79]" : "text-white hover:text-white/80",
                )}
              >
                Homme
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300",
                    isScrolled ? "bg-[#415b58]" : "bg-white",
                  )}
                />
              </button>
              <button
                onClick={() => handleCategoryClick("femme")}
                className={cn(
                  "text-base relative group transition-colors font-black",
                  isScrolled ? "text-[#415b58] hover:text-[#5a7d79]" : "text-white hover:text-white/80",
                )}
              >
                Femme
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300",
                    isScrolled ? "bg-[#415b58]" : "bg-white",
                  )}
                />
              </button>
            </nav>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              {/* Desktop Action Icons - Search and Shopping Bag */}
              <div className="hidden md:flex items-center space-x-4">
                <button
                  className={cn(
                    "transition-colors",
                    isScrolled ? "text-[#415b58] hover:text-[#5a7d79]" : "text-white hover:text-white/80",
                  )}
                  aria-label="Rechercher"
                >
                  <Search size={20} />
                </button>
                <button
                  onClick={openCart}
                  className={cn(
                    "transition-colors relative",
                    isScrolled ? "text-[#415b58] hover:text-[#5a7d79]" : "text-white hover:text-white/80",
                  )}
                  aria-label="Panier"
                >
                  <ShoppingBag size={20} />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#415b58] text-white text-xs flex items-center justify-center cart-counter">
                      {totalItems}
                    </span>
                  )}
                </button>
              </div>

              {/* Mobile Icons */}
              <div className="flex items-center space-x-3 md:hidden">
                <button
                  className={cn(
                    "transition-colors",
                    isScrolled ? "text-[#415b58] hover:text-[#5a7d79]" : "text-white hover:text-white/80",
                  )}
                  aria-label="Rechercher"
                >
                  <Search size={20} />
                </button>
                <button
                  onClick={openCart}
                  className={cn(
                    "relative transition-colors",
                    isScrolled ? "text-[#415b58] hover:text-[#5a7d79]" : "text-white hover:text-white/80",
                  )}
                  aria-label="Panier"
                >
                  <ShoppingBag size={20} />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#415b58] text-white text-xs flex items-center justify-center cart-counter">
                      {totalItems}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black z-50 md:hidden"
                onClick={() => setIsMenuOpen(false)}
                style={{ height: windowHeight }}
              />

              {/* Menu */}
              <motion.div
                initial="closed"
                animate="open"
                exit="exit"
                variants={menuVariants}
                className="fixed top-0 left-0 bottom-0 w-4/5 max-w-sm bg-white shadow-xl z-50 md:hidden"
                style={{ height: windowHeight }}
              >
                <div className="flex flex-col h-full">
                  {/* Menu Header */}
                  <div className="flex justify-between items-center p-5 border-b border-gray-100">
                    <img
                      src="/fulllogoblack.png"
                      alt="Ayouni Optic Logo"
                      className="h-12 w-auto"
                    />
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="p-2 hover:bg-[#415b58]/10 transition-colors"
                      aria-label="Fermer le menu"
                    >
                      <X size={24} className="text-[#415b58]" />
                    </button>
                  </div>

                  {/* Menu Items */}
                  <div className="flex-1 overflow-y-auto py-6 px-5">
                    <nav className="space-y-6">
                      {menuItems.map((item, i) => (
                        <motion.div
                          key={item.name}
                          custom={i}
                          variants={menuItemVariants}
                          initial="closed"
                          animate="open"
                        >
                          <Link
                            href={item.href}
                            className="block text-[#415b58] hover:text-[#5a7d79] hover:bg-[#415b58]/5 transition-colors font-black py-3 px-0 text-lg"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {item.name}
                          </Link>
                        </motion.div>
                      ))}
                      <motion.div key="homme" custom={2} variants={menuItemVariants} initial="closed" animate="open">
                        <button
                          onClick={() => {
                            handleCategoryClick("homme")
                            setIsMenuOpen(false)
                          }}
                          className="block text-[#415b58] hover:text-[#5a7d79] hover:bg-[#415b58]/5 transition-colors font-black py-3 px-0 text-lg"
                        >
                          Homme
                        </button>
                      </motion.div>
                      <motion.div key="femme" custom={3} variants={menuItemVariants} initial="closed" animate="open">
                        <button
                          onClick={() => {
                            handleCategoryClick("femme")
                            setIsMenuOpen(false)
                          }}
                          className="block text-[#415b58] hover:text-[#5a7d79] hover:bg-[#415b58]/5 transition-colors font-black py-3 px-0 text-lg"
                        >
                          Femme
                        </button>
                      </motion.div>
                    </nav>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* Category Modal - Outside header */}
      <CategoryModal isOpen={categoryModalOpen} onClose={closeCategoryModal} category={selectedCategory} />
    </>
  )
}
