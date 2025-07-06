export default function LocationSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-[#415b58] mb-4">Notre Localisation</h2>
          <div className="w-24 h-1 bg-[#415b58] mx-auto"></div>
        </div>

        {/* Google Map */}
        <div className="w-full h-96 md:h-[500px] bg-gray-200 overflow-hidden shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3397.175!2d-7.9898!3d31.6295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdafee8d96179e51%3A0x5950b6534f87adb8!2sJemaa%20el-Fnaa%2C%20Marrakech%2040000%2C%20Morocco!5e0!3m2!1sen!2sma!4v1699999999999!5m2!1sen!2sma"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Localisation Ayouni Optic - Jamaa el Fna, Marrakech"
          ></iframe>
        </div>
      </div>
    </section>
  )
}
