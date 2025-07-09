"use client"

export default function BannerSection() {
  const items = [
    { type: "text", content: "Vision Claire" },
    { type: "image", src: "https://expertlunette.ma/cdn/shop/files/1_2_f2b96751-0111-4fa9-979b-8382df9aa4d6.png?v=1744948785" },
    { type: "text", content: "Style Unique" },
    {
      type: "image",
      src: "https://expertlunette.ma/cdn/shop/files/1.png?v=1744948694",
    },
    { type: "text", content: "Qualité Premium" },
    {
      type: "image",
      src: "https://expertlunette.ma/cdn/shop/files/3_1.png?v=1744948579",
    },
    { type: "text", content: "Service Expert" },
    {
      type: "image",
      src: "https://expertlunette.ma/cdn/shop/files/3_2.png?v=1744948604",
    },
    { type: "text", content: "Mode Tendance" },
    {
      type: "image",
      src: "https://expertlunette.ma/cdn/shop/files/3_3.png?v=1744948964",
    },
    { type: "text", content: "Confort Optimal" },
    {
      type: "image",
      src: "https://expertlunette.ma/cdn/shop/files/1_2_f2b96751-0111-4fa9-979b-8382df9aa4d6.png?v=1744948785",
    },
    { type: "text", content: "Protection Totale" },
    {
      type: "image",
      src: "https://expertlunette.ma/cdn/shop/files/3_1.png?v=1744948579",
    },
  ]

  return (
    <section className="pb-0 pt-12 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
          <div className="flex w-max animate-marquee">
            {/* First Group */}
            <div className="flex items-center">
              {items.map((item, index) => (
                <div key={`group1-${index}`} className="mx-3 flex-shrink-0">
                  {item.type === "text" ? (
                    <span className="bg-[#415b58] text-white px-4 py-2 rounded-lg font-semibold text-lg whitespace-nowrap">
                      {(item.content ?? "").toUpperCase()}
                    </span>
                  ) : (
                    <div className="w-20 h-12 rounded-lg overflow-hidden">
                      <img
                        src={item.src || "/placeholder.svg"}
                        alt="Optical product"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Second Group (duplicate for seamless loop) */}
            <div className="flex items-center">
              {items.map((item, index) => (
                <div key={`group2-${index}`} className="mx-6 flex-shrink-0">
                  {item.type === "text" ? (
                    <span className="bg-[#415b58] text-white px-4 py-2 rounded-lg font-semibold text-lg whitespace-nowrap">
                      {(item.content ?? "").toUpperCase()}
                    </span>
                  ) : (
                    <div className="w-20 h-12 rounded-lg overflow-hidden">
                      <img
                        src={item.src || "/placeholder.svg"}
                        alt="Optical product"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-marquee {
          animation: marquee 50s linear infinite;
        }
      `}</style>
    </section>
  )
}
