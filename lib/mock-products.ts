export interface Product {
  id: number
  name: string
  price: number
  oldPrice: number
  image: string
  images: string[]
  category: "homme" | "femme"
  type: "vue" | "soleil"
  inStock: boolean
  description?: string
}

export const mockProducts: Product[] = [
  // Homme - Lunettes de Vue
  {
    id: 1,
    name: "Monture Classique Homme",
    price: 1200,
    oldPrice: 1500,
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=400&fit=crop&crop=center",
    images: [
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=400&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=400&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1607522379027-bb549e9f131d?w=400&h=400&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1556306535-38febf6782e7?w=400&h=400&fit=crop&crop=center",
    ],
    category: "homme",
    type: "vue",
    inStock: true,
    description:
      "Monture classique pour homme alliant élégance et confort. Parfaite pour un usage quotidien avec un style intemporel.",
  },
  {
    id: 2,
    name: "Lunettes Business Élégantes",
    price: 950,
    oldPrice: 1200,
    image: "https://images.unsplash.com/photo-1556306535-38febf6782e7?w=400&h=400&fit=crop&crop=center",
    images: [
      "https://images.unsplash.com/photo-1556306535-38febf6782e7?w=400&h=400&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1607522379027-bb549e9f131d?w=400&h=400&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1585305849148-49a2b107b551?w=400&h=400&fit=crop&crop=center",
    ],
    category: "homme",
    type: "vue",
    inStock: true,
    description: "Lunettes élégantes parfaites pour le milieu professionnel. Design moderne et sophistiqué.",
  },
  {
    id: 3,
    name: "Monture Sport Vision",
    price: 800,
    oldPrice: 1000,
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=400&fit=crop&crop=center",
    images: [
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=400&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=400&fit=crop&crop=center",
    ],
    category: "homme",
    type: "vue",
    inStock: false,
    description: "Monture sportive conçue pour les activités physiques. Légère et résistante.",
  },

  // Homme - Lunettes de Soleil
  {
    id: 4,
    name: "Aviateur Classique",
    price: 1500,
    oldPrice: 1800,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop&crop=center",
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1585305849148-49a2b107b551?w=400&h=400&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&h=400&fit=crop&crop=center",
    ],
    category: "homme",
    type: "soleil",
    inStock: true,
    description: "Lunettes aviateur classiques avec protection UV maximale. Style iconique et intemporel.",
  },
  {
    id: 5,
    name: "Lunettes Sport Solaire",
    price: 1100,
    oldPrice: 1400,
    image: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&h=400&fit=crop&crop=center",
    images: [
      "https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&h=400&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1607522379027-bb549e9f131d?w=400&h=400&fit=crop&crop=center",
    ],
    category: "homme",
    type: "soleil",
    inStock: true,
    description: "Lunettes de soleil sportives avec verres polarisés. Idéales pour les activités extérieures.",
  },

  // Femme - Lunettes de Vue
  {
    id: 6,
    name: "Monture Élégante Femme",
    price: 1800,
    oldPrice: 2200,
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=400&fit=crop&crop=center",
    images: [
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=400&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1585305849148-49a2b107b551?w=400&h=400&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1556306535-38febf6782e7?w=400&h=400&fit=crop&crop=center",
    ],
    category: "femme",
    type: "vue",
    inStock: true,
    description: "Monture élégante pour femme avec un design raffiné. Parfaite pour toutes les occasions.",
  },
  {
    id: 7,
    name: "Lunettes Vintage Chic",
    price: 1600,
    oldPrice: 1900,
    image: "https://images.unsplash.com/photo-1556306535-38febf6782e7?w=400&h=400&fit=crop&crop=center",
    images: [
      "https://images.unsplash.com/photo-1556306535-38febf6782e7?w=400&h=400&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1607522379027-bb549e9f131d?w=400&h=400&fit=crop&crop=center",
    ],
    category: "femme",
    type: "vue",
    inStock: true,
    description: "Style vintage chic avec une touche moderne. Design unique et sophistiqué.",
  },

  // Femme - Lunettes de Soleil
  {
    id: 8,
    name: "Solaires Glamour",
    price: 2200,
    oldPrice: 2600,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop&crop=center",
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1585305849148-49a2b107b551?w=400&h=400&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&h=400&fit=crop&crop=center",
    ],
    category: "femme",
    type: "soleil",
    inStock: true,
    description: "Lunettes de soleil glamour avec un style sophistiqué. Protection UV et élégance réunies.",
  },
  {
    id: 9,
    name: "Lunettes Cat-Eye Moderne",
    price: 1900,
    oldPrice: 2300,
    image: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&h=400&fit=crop&crop=center",
    images: [
      "https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&h=400&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1607522379027-bb549e9f131d?w=400&h=400&fit=crop&crop=center",
    ],
    category: "femme",
    type: "soleil",
    inStock: false,
    description: "Design cat-eye moderne avec une allure rétro-chic. Style distinctif et féminin.",
  },
]

export function getProductById(id: number): Product | undefined {
  return mockProducts.find((product) => product.id === id)
}
