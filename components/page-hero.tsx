interface PageHeroProps {
  title: string
  subtitle: string
  backgroundImage: string
}

export default function PageHero({ title, subtitle, backgroundImage }: PageHeroProps) {
  return (
    <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img src={backgroundImage || "/placeholder.svg"} alt="Hero Background" className="w-full h-full object-cover" />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Hero Content */}
      <div className="relative z-10 h-full flex items-end pb-16 md:pb-20 px-4">
        <div className="max-w-7xl mx-auto w-full">
          <div className="max-w-2xl">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">{title}</h1>
            <p className="text-sm md:text-base text-white/90 font-normal">{subtitle}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
