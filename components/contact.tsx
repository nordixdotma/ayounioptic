"use client"

import type React from "react"
import { useInView } from "react-intersection-observer"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Instagram, Loader2 } from "lucide-react"
import { useState } from "react"

export default function Contact() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const [formStatus, setFormStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({
    type: null,
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({
        type: "error",
        message: "Veuillez remplir tous les champs obligatoires.",
      })
      return
    }

    setIsSubmitting(true)
    setFormStatus({ type: null, message: "" })

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setFormStatus({
        type: "success",
        message: "Votre message a été envoyé avec succès!",
      })
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      setFormStatus({
        type: "error",
        message: "Une erreur s'est produite. Veuillez réessayer plus tard.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section id="contact" className="py-12 sm:py-16 md:py-20 bg-white">
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.div variants={itemVariants} className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#415b58] mb-3">Contactez-Nous</h2>
          <div className="w-16 sm:w-24 h-1 bg-[#415b58] mx-auto mb-4"></div>
          <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto font-normal">
            Intéressé par nos lunettes ou vous avez des questions? Nous serions ravis de vous entendre.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="text-xl sm:text-2xl font-black text-[#415b58] mb-4">Informations de Contact</h3>

            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-[#415b58] mt-0.5" />
              <div>
                <h4 className="text-sm sm:text-base font-black text-gray-900">Adresse</h4>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 font-normal">
                  Marrakech, Qussaryat Salam
                  <br />
                  2ème étage Jamaa el fna
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Phone className="w-5 h-5 text-[#415b58] mt-0.5" />
              <div>
                <h4 className="text-sm sm:text-base font-black text-gray-900">Téléphones</h4>
                <div className="space-y-1">
                  <a
                    href="tel:+212696570164"
                    className="text-xs sm:text-sm text-gray-600 hover:text-[#415b58] transition-colors block font-normal"
                    aria-label="Appeler 06 96 57 01 64"
                  >
                    06 96 57 01 64
                  </a>
                  <a
                    href="tel:+212666407344"
                    className="text-xs sm:text-sm text-gray-600 hover:text-[#415b58] transition-colors block font-normal"
                    aria-label="Appeler 06 66 40 73 44"
                  >
                    06 66 40 73 44
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-[#415b58] mt-0.5" />
              <div>
                <h4 className="text-sm sm:text-base font-black text-gray-900">Email</h4>
                <a
                  href="mailto:contact@ayounioptic.ma"
                  className="text-xs sm:text-sm text-gray-600 mt-1 hover:text-[#415b58] transition-colors block font-normal"
                  aria-label="Envoyer un email à contact@ayounioptic.ma"
                >
                  contact@ayounioptic.ma
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Instagram className="w-5 h-5 text-[#415b58] mt-0.5" />
              <div>
                <h4 className="text-sm sm:text-base font-black text-gray-900">Instagram</h4>
                <a
                  href="https://instagram.com/ayounioptic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm text-gray-600 mt-1 hover:text-[#415b58] transition-colors block font-normal"
                  aria-label="Visitez notre profil Instagram @ayounioptic"
                >
                  @ayounioptic
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {formStatus.type && (
                <div
                  className={`p-3 ${
                    formStatus.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                  }`}
                >
                  {formStatus.message}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-xs sm:text-sm font-black text-gray-700 mb-1">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 focus:ring-[#415b58] focus:border-[#415b58] outline-none transition font-normal"
                    placeholder="Votre nom"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs sm:text-sm font-black text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 focus:ring-[#415b58] focus:border-[#415b58] outline-none transition font-normal"
                    placeholder="Votre email"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs sm:text-sm font-black text-gray-700 mb-1">
                  Numéro de Téléphone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 focus:ring-[#415b58] focus:border-[#415b58] outline-none transition font-normal"
                  placeholder="Votre numéro de téléphone"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-xs sm:text-sm font-black text-gray-700 mb-1">
                  Sujet
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 focus:ring-[#415b58] focus:border-[#415b58] outline-none transition font-normal"
                  placeholder="Sujet de votre message"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs sm:text-sm font-black text-gray-700 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 focus:ring-[#415b58] focus:border-[#415b58] outline-none transition font-normal"
                  placeholder="Votre message"
                  required
                ></textarea>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-2 sm:px-6 sm:py-3 bg-[#415b58] text-white text-sm font-black hover:bg-[#5a7d79] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="mr-2 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  "Envoyer le Message"
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
