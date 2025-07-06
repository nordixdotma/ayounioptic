"use client"

import { useState, useEffect, useRef } from "react"

export default function AboutSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -100px 0px",
      },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <section ref={sectionRef} id="about" className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-center">
          <div className="md:col-span-3">
            <h2
              className={`text-2xl md:text-3xl lg:text-4xl font-black text-[#415b58] mb-8 transition-all duration-1000 ease-out ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
            >
              À Propos d'Ayouni Optic
            </h2>
            <div className="text-gray-600">
              <p
                className={`mb-6 text-sm md:text-base leading-relaxed text-justify font-normal transition-all duration-1000 ease-out delay-200 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                Ayouni Optic est votre spécialiste en optique de confiance situé au cœur de Marrakech. Nous offrons des
                solutions visuelles de qualité supérieure pour toute la famille.
              </p>
              <p
                className={`mb-6 text-sm md:text-base leading-relaxed text-justify font-normal transition-all duration-1000 ease-out delay-400 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                Notre équipe d'experts vous accompagne dans le choix de vos lunettes de vue et de soleil. Nous proposons
                une large gamme de montures adaptées à tous les goûts et budgets.
              </p>
              <p
                className={`text-sm md:text-base leading-relaxed text-justify font-normal transition-all duration-1000 ease-out delay-600 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                Votre vision est notre passion. Nous garantissons un service personnalisé avec une satisfaction à 100%
                et un achat sans risque.
              </p>
            </div>

            <div
              className={`mt-8 text-lg md:text-xl font-black text-[#415b58] transition-all duration-1000 ease-out delay-800 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <span>"Votre vision, Notre Passion"</span>
            </div>

            <div
              className={`h-1 bg-gradient-to-r from-[#415b58]/60 to-[#415b58] mt-8 transition-all duration-1000 ease-out delay-800 ${
                isVisible ? "w-24 opacity-100" : "w-0 opacity-0"
              }`}
            />
          </div>

          <div
            className={`md:col-span-2 aspect-square bg-gray-100 overflow-hidden relative transition-all duration-1200 ease-out delay-300 ${
              isVisible ? "opacity-100 translate-x-0 scale-100" : "opacity-0 translate-x-8 scale-95"
            }`}
          >
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=500&fit=crop&crop=center"
              alt="Magasin Ayouni Optic"
              className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
            />

            <div
              className={`absolute -top-4 -left-4 w-16 h-16 border-2 border-[#415b58]/40 transition-all duration-1000 ease-out delay-1000 ${
                isVisible ? "opacity-30 scale-100 rotate-0" : "opacity-0 scale-50 -rotate-45"
              }`}
            />
            <div
              className={`absolute -bottom-4 -right-4 w-12 h-12 border-2 border-[#415b58]/40 transition-all duration-1000 ease-out delay-1200 ${
                isVisible ? "opacity-30 scale-100 rotate-0" : "opacity-0 scale-50 rotate-45"
              }`}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
