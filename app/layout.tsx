import type React from "react"
import type { Metadata } from "next"
import { Roboto } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/lib/cart-context"

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "900"],
  variable: "--font-roboto",
})

export const metadata: Metadata = {
  title: "Ayouni Optic - عيوني أوبتيك | Votre vision, Notre Passion",
  description:
    "Spécialiste en optique à Marrakech. Large gamme de lunettes de vue et de soleil pour toute la famille. Qussaryat Salam, 2ème étage Jamaa el fna.",
  keywords: "lunettes, optique, Marrakech, lunettes de vue, lunettes de soleil, عيوني أوبتيك",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={roboto.variable} translate="no">
      <head>
        <meta name="google" content="notranslate" />
        <link rel="icon" href="/whitelogo.png" sizes="any" />
      </head>
      <body className="font-roboto antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  )
}
