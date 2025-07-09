import { Package, BadgeCheck, Glasses } from "lucide-react"

export default function ServicesSection() {
  return (
    <section id="services" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Suivi de commande */}
          <div className="bg-[#415b58]/5 border border-[#415b58]/20 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:border-[#415b58]/40 transition-all duration-300 flex flex-col items-center text-center">
            <Package className="w-10 h-10 text-[#415b58] mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3 font-optima">Suivi de commande</h3>
            <p className="text-gray-700 leading-relaxed">
              Si vous avez acheté vos lunettes dans l'un de nos magasins et vous souhaitez connaître le statut de votre
              commande ?
            </p>
          </div>

          {/* 100% Remboursé */}
          <div className="bg-[#415b58]/5 border border-[#415b58]/20 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:border-[#415b58]/40 transition-all duration-300 flex flex-col items-center text-center">
            <BadgeCheck className="w-10 h-10 text-[#415b58] mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3 font-optima">100% Remboursé</h3>
            <p className="text-gray-700 leading-relaxed">
              Dans tous nos magasins, la Réforme 100% Santé donne droit à un Reste à charge de 0DH sur tout notre
              catalogue.
            </p>
          </div>

          {/* 2 paires à 0€ */}
          <div className="bg-[#415b58]/5 border border-[#415b58]/20 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:border-[#415b58]/40 transition-all duration-300 flex flex-col items-center text-center">
            <Glasses className="w-10 h-10 text-[#415b58] mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3 font-optima">2 paires à 0DH</h3>
            <p className="text-gray-700 leading-relaxed">
              2 paires de lunettes au choix pour 0DH ! Zéro avance, zéro stress : tiers payant, valable avec toutes les
              mutuelles !
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
