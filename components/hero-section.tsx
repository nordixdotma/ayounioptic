"use client"

import { useState, useEffect } from "react"
import ScrollIndicator from "./scroll-indicator"

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [viewportHeight, setViewportHeight] = useState("100vh")

  const heroImages = [
    "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=1200&h=800&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1200&h=800&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1577803645773-f96470509666?w=1200&h=800&fit=crop&crop=center",
  ]

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [heroImages.length])

  // Fix mobile viewport height
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty("--vh", `${vh}px`)
      setViewportHeight(`${window.innerHeight}px`)
    }

    setVH()
    window.addEventListener("resize", setVH)
    window.addEventListener("orientationchange", setVH)

    return () => {
      window.removeEventListener("resize", setVH)
      window.removeEventListener("orientationchange", setVH)
    }
  }, [])

  return (
    <section
      className="relative overflow-hidden"
      style={{
        height: viewportHeight,
        minHeight: "100dvh", // For browsers that support dynamic viewport units
      }}
    >
      {/* Background Images Slideshow */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={image || "/placeholder.svg"}
              alt={`Lunettes Ayouni Optic ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Hero Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-4">
        <div className="text-center max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-black text-white leading-tight">
            100 % de satisfaction, achat avec 0 risque
          </h1>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <ScrollIndicator />
      </div>
    </section>
  )
}
