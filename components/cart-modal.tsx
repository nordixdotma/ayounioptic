"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Minus, Plus, ShoppingBag, Trash2, FileText } from "lucide-react"
import { useCart } from "@/lib/cart-context"

export default function CartModal() {
  const { items, totalItems, totalPrice, isCartOpen, closeCart, updateQuantity, removeItem, clearCart } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    comment: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckout = () => {
    setIsCheckingOut(true)
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()

    // Create order object
    const order = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      customerInfo: formData,
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        category: item.category,
        type: item.type,
        prescriptionFileName: item.prescriptionFileName || null,
        size: item.size || null,
        color: item.color || null,
      })),
      totalPrice: totalPrice,
      totalItems: totalItems,
    }

    // Save order to localStorage
    try {
      const existingOrders = JSON.parse(localStorage.getItem("ayouni-orders") || "[]")
      existingOrders.push(order)
      localStorage.setItem("ayouni-orders", JSON.stringify(existingOrders))

      alert("Commande enregistrée avec succès! Nous vous contacterons bientôt.")
      closeCart()
      setIsCheckingOut(false)
      clearCart()

      // Reset form
      setFormData({
        fullName: "",
        phone: "",
        address: "",
        comment: "",
      })
    } catch (error) {
      console.error("Error saving order:", error)
      alert("Erreur lors de l'enregistrement de la commande. Veuillez réessayer.")
    }
  }

  const handleWhatsAppOrder = () => {
    const phoneNumber = "+212696570164"
    let message = `Bonjour, je souhaite commander:\n\n`

    items.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`
      message += `   - Quantité: ${item.quantity}\n`
      message += `   - Prix: ${item.price} DH\n`
      if (item.prescriptionFileName) {
        message += `   - Ordonnance: ${item.prescriptionFileName}\n`
      }
      message += `\n`
    })

    message += `Total: ${totalPrice.toFixed(2)} DH\n\n`
    message += `Merci!`

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  if (!isCartOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={closeCart}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white shadow-xl w-full max-w-md overflow-hidden flex flex-col"
          style={{ maxHeight: "calc(100vh - 2rem)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
            <h2 className="text-lg font-black text-[#415b58] flex items-center">
              <ShoppingBag size={18} className="mr-2" />
              {isCheckingOut ? "Informations" : `Panier (${totalItems})`}
            </h2>
            <button
              onClick={closeCart}
              className="p-1 hover:bg-gray-100 transition-colors"
              aria-label="Fermer le panier"
            >
              <X size={18} />
            </button>
          </div>

          {items.length === 0 ? (
            <div className="p-8 text-center flex-grow">
              <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <ShoppingBag size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-black text-[#415b58] mb-1">Panier vide</h3>
              <p className="text-gray-500 text-sm font-normal">Commencez vos achats pour ajouter des produits</p>
            </div>
          ) : isCheckingOut ? (
            <>
              <div className="p-4 bg-gray-50">
                <form className="space-y-3">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-black text-gray-700 mb-1">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Votre nom complet"
                      className="w-full px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#415b58] focus:border-[#415b58] font-normal"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-black text-gray-700 mb-1">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+212 XXXXXXXXX"
                      className="w-full px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#415b58] focus:border-[#415b58] font-normal"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-black text-gray-700 mb-1">
                      Adresse de livraison *
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      rows={2}
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Votre adresse complète"
                      className="w-full px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#415b58] focus:border-[#415b58] font-normal"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="comment" className="block text-sm font-black text-gray-700 mb-1">
                      Commentaire
                    </label>
                    <textarea
                      id="comment"
                      name="comment"
                      rows={2}
                      value={formData.comment}
                      onChange={handleInputChange}
                      placeholder="Commentaire ou instructions spéciales (optionnel)"
                      className="w-full px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#415b58] focus:border-[#415b58] font-normal"
                    />
                  </div>
                </form>
              </div>

              <div className="border-t border-gray-200 p-4 bg-white">
                <div className="flex justify-between font-black mb-3">
                  <span className="text-lg text-[#415b58]">{totalPrice.toFixed(2)} DH</span>
                  <span>Total:</span>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsCheckingOut(false)}
                    className="flex-1 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-black"
                  >
                    Retour
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitOrder}
                    className="flex-1 py-2 bg-[#415b58] text-white hover:bg-[#5a7d79] transition-colors font-black"
                  >
                    Commander
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="overflow-y-auto" style={{ maxHeight: "400px" }}>
                <ul className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <li key={`${item.id}`} className="p-4 flex">
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden border border-gray-200">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>

                      <div className="ml-4 flex flex-1 flex-col">
                        <div className="flex justify-between text-base font-black text-gray-900">
                          <p className="text-sm font-black text-[#415b58]">{item.price} DH</p>
                          <h3 className="text-sm font-black truncate max-w-[120px]">{item.name}</h3>
                        </div>

                        {/* Prescription File Indicator */}
                        {item.prescriptionFileName && (
                          <div className="mt-1 mb-2">
                            <div className="flex items-center text-xs text-blue-600 bg-blue-50 px-2 py-1 w-fit">
                              <FileText size={12} className="mr-1" />
                              <span className="truncate max-w-[100px]">{item.prescriptionFileName}</span>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-auto">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 transition-colors"
                            aria-label="Supprimer le produit"
                          >
                            <Trash2 size={16} />
                          </button>

                          <div className="flex items-center border border-gray-300">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-gray-100"
                              aria-label="Augmenter la quantité"
                            >
                              <Plus size={14} />
                            </button>
                            <span className="px-3 text-sm font-black">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-gray-100"
                              aria-label="Diminuer la quantité"
                            >
                              <Minus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-gray-200 p-4 bg-white mt-auto">
                <div className="flex justify-between font-black mb-3">
                  <span className="text-lg text-[#415b58]">{totalPrice.toFixed(2)} DH</span>
                  <span>Total:</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleCheckout}
                    className="flex-1 py-2.5 bg-[#415b58] text-white hover:bg-[#5a7d79] transition-colors font-black"
                  >
                    Commander
                  </button>

                  <button
                    onClick={handleWhatsAppOrder}
                    className="py-2.5 px-4 bg-green-500 text-white hover:bg-green-600 transition-colors font-black flex items-center justify-center"
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
                  </button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
