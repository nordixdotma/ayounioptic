"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingBag, Check, ArrowLeft, ArrowRight, Upload, X, FileText } from "lucide-react"
import type { Product } from "@/lib/mock-products"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"

interface ProductDetailProps {
  product: Product
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isAddedToCart, setIsAddedToCart] = useState(false)
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false)
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null)
  const { addItem } = useCart()

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))
  }

  const handleAddToCart = () => {
    // For medical glasses (vue), show prescription upload modal
    if (product.type === "vue") {
      setShowPrescriptionModal(true)
    } else {
      // For sunglasses, add directly to cart
      addToCartWithPrescription()
    }
  }

  const addToCartWithPrescription = (file?: File) => {
    addItem(product, quantity, undefined, undefined, file)
    setIsAddedToCart(true)
    setShowPrescriptionModal(false)
    setTimeout(() => {
      setIsAddedToCart(false)
    }, 3000)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
      ]
      if (allowedTypes.includes(file.type)) {
        setPrescriptionFile(file)
      } else {
        alert("Veuillez sélectionner un fichier PDF ou DOCX")
      }
    }
  }

  const handlePrescriptionSubmit = () => {
    addToCartWithPrescription(prescriptionFile || undefined)
  }

  const handleSkipPrescription = () => {
    addToCartWithPrescription()
  }

  const handleWhatsAppInquiry = () => {
    const phoneNumber = "+212696570164"
    let message = `Bonjour, je suis intéressé(e) par ce produit:\n\n`
    message += `*${product.name}*\n`
    message += `Prix: ${product.price} DH\n`
    message += `\nPouvez-vous me donner plus d'informations?`

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 pb-16 md:pb-24">
        {/* Back Button */}
        <Link
          href={`/${product.category}/${product.type}`}
          className="inline-flex items-center text-[#415b58] hover:text-[#5a7d79] mb-8 font-black"
        >
          <ArrowLeft size={20} className="mr-2" />
          Retour aux produits
        </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Product Images */}
          <div className="space-y-4">
            {/* Main Image Container - Reduced size on desktop */}
            <div className="relative w-full h-80 md:h-96 lg:h-[450px] overflow-hidden bg-gray-50 shadow-sm mx-auto">
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 z-10 -translate-y-1/2 bg-white/80 p-2 shadow-md hover:bg-white transition-colors duration-200"
                    aria-label="Image précédente"
                  >
                    <ArrowLeft size={18} className="text-[#415b58]" />
                  </button>

                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 z-10 -translate-y-1/2 bg-white/80 p-2 shadow-md hover:bg-white transition-colors duration-200"
                    aria-label="Image suivante"
                  >
                    <ArrowRight size={18} className="text-[#415b58]" />
                  </button>
                </>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="h-full w-full"
                >
                  <img
                    src={product.images[selectedImage] || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </AnimatePresence>

              {product.images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-white/80 px-3 py-1 text-xs font-black text-[#415b58]">
                  {selectedImage + 1} / {product.images.length}
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {product.images.map((image, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImage(index)}
                    className={`relative overflow-hidden ${
                      selectedImage === index
                        ? "ring-2 ring-[#415b58] ring-offset-2"
                        : "ring-1 ring-gray-200 hover:ring-[#415b58]/50"
                    } w-16 h-16 md:w-20 md:h-20 transition-all duration-200 flex-shrink-0`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} - Vue ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Product Details */}
          <div className="flex flex-col space-y-6">
            {/* Product Name and Pricing */}
            <div className="border-b border-gray-100 pb-6">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#415b58] mb-4">{product.name}</h1>

                {/* Pricing */}
                <div className="mb-3">
                  <p className="text-lg text-gray-400 line-through font-normal">{product.oldPrice} DH</p>
                  <p className="text-2xl sm:text-3xl font-black text-[#415b58]">{product.price} DH</p>
                  <p className="text-sm text-green-600 font-normal">Économisez {product.oldPrice - product.price} DH</p>
                </div>
              </motion.div>

              {/* Stock Status */}
              <div className="mt-2">
                {product.inStock ? (
                  <p className="text-green-600 text-sm flex items-center font-normal">
                    <Check size={16} className="mr-1" />
                    En stock
                  </p>
                ) : (
                  <p className="text-red-500 text-sm flex items-center font-normal">
                    <span className="mr-1">•</span>
                    Rupture de stock
                  </p>
                )}
              </div>
            </div>

            {/* Medical Glasses Notice */}
            {product.type === "vue" && (
              <div className="bg-blue-50 border border-blue-200 p-4">
                <div className="flex items-start">
                  <FileText className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-black text-blue-800 mb-1">Lunettes de Vue Médicales</h4>
                    <p className="text-xs text-blue-700 font-normal">
                      Pour les lunettes de vue, vous pouvez télécharger votre ordonnance médicale pour un service
                      personnalisé.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Product Description */}
            <div className="pt-2">
              <h3 className="text-lg font-black text-[#415b58] mb-3">Description</h3>
              <p className="text-gray-600 font-normal leading-relaxed">
                {product.description ||
                  `Découvrez ${product.name}, une paire de lunettes ${
                    product.type === "vue" ? "de vue" : "de soleil"
                  } ${product.category === "homme" ? "pour homme" : "pour femme"} alliant style et confort. 
                  Fabriquées avec des matériaux de qualité supérieure, ces lunettes offrent une excellente durabilité 
                  et un design moderne qui s'adapte à tous les styles.`}
              </p>
            </div>

            {/* Add to Cart Section */}
            <div className="pt-4">
              <div className="flex flex-col space-y-4">
                {/* Add to Cart Button */}
                <div>
                  {isAddedToCart ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full bg-green-100 text-green-800 px-4 py-3 flex items-center justify-center font-black"
                    >
                      <Check size={18} className="mr-2" />
                      Ajouté au panier
                    </motion.div>
                  ) : (
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAddToCart}
                        disabled={!product.inStock}
                        className="flex-1 py-3 px-4 bg-[#415b58] text-white flex items-center justify-center hover:bg-[#5a7d79] transition-colors disabled:opacity-70 disabled:cursor-not-allowed font-black"
                      >
                        <ShoppingBag size={18} className="mr-2" />
                        {product.inStock ? "Ajouter au panier" : "Non disponible"}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleWhatsAppInquiry}
                        className="py-3 px-4 bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-colors font-black"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="18"
                          height="18"
                          fill="currentColor"
                          className="mr-2"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        WhatsApp
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prescription Upload Modal */}
      <AnimatePresence>
        {showPrescriptionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowPrescriptionModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white shadow-xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-black text-[#415b58] flex items-center">
                    <FileText size={20} className="mr-2" />
                    Ordonnance Médicale
                  </h3>
                  <button
                    onClick={() => setShowPrescriptionModal(false)}
                    className="p-1 hover:bg-gray-100 transition-colors"
                    aria-label="Fermer"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-600 font-normal mb-4 text-sm">
                  Pour des lunettes de vue parfaitement adaptées, vous pouvez télécharger votre ordonnance médicale (PDF
                  ou DOCX).
                </p>

                {/* File Upload Area */}
                <div className="border-2 border-dashed border-gray-300 p-6 text-center mb-4 hover:border-[#415b58] transition-colors">
                  <input
                    type="file"
                    id="prescription-upload"
                    accept=".pdf,.docx,.doc"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label htmlFor="prescription-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-black text-gray-700 mb-1">Cliquez pour télécharger votre ordonnance</p>
                    <p className="text-xs text-gray-500 font-normal">PDF ou DOCX uniquement</p>
                  </label>
                </div>

                {/* Selected File Display */}
                {prescriptionFile && (
                  <div className="bg-green-50 border border-green-200 p-3 mb-4 flex items-center">
                    <FileText className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm font-normal text-green-800 truncate">{prescriptionFile.name}</span>
                    <button
                      onClick={() => setPrescriptionFile(null)}
                      className="ml-auto text-green-600 hover:text-green-800"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleSkipPrescription}
                    className="flex-1 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-black text-sm"
                  >
                    Continuer sans ordonnance
                  </button>
                  <button
                    onClick={handlePrescriptionSubmit}
                    className="flex-1 py-2.5 bg-[#415b58] text-white hover:bg-[#5a7d79] transition-colors font-black text-sm"
                  >
                    {prescriptionFile ? "Ajouter avec ordonnance" : "Ajouter au panier"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
