export function Hero() {
  return (
    <main className="max-w-7xl mx-auto px-8 py-20">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl shadow-navy-500/15 overflow-hidden border border-beige-200/50">
        {/* Hero Header */}
        <div className="bg-gradient-to-br from-navy-600 via-navy-700 to-brown-600 text-white p-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
          <div className="relative">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight">Colegio Excelencia Académica</h1>
            <p className="text-2xl md:text-3xl text-beige-200 font-medium">Formando líderes del mañana</p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-10 p-16">
          {/* Misión */}
          <div className="space-y-5 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-coral-500 to-burgundy-600 flex items-center justify-center rounded-2xl shadow-lg shadow-coral-500/30 group-hover:shadow-xl group-hover:shadow-coral-500/40 transition-all duration-300 transform group-hover:scale-110">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-4xl font-bold text-navy-700">Nuestra Misión</h2>
            </div>
            <p className="text-lg text-brown-600 leading-relaxed">
              Brindar educación de calidad que forme estudiantes íntegros, críticos y comprometidos con su comunidad,
              desarrollando sus habilidades académicas, sociales y emocionales en un ambiente de respeto y excelencia.
            </p>
          </div>

          {/* Visión */}
          <div className="space-y-5 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-burgundy-600 to-navy-700 flex items-center justify-center rounded-2xl shadow-lg shadow-burgundy-600/30 group-hover:shadow-xl group-hover:shadow-burgundy-600/40 transition-all duration-300 transform group-hover:scale-110">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h2 className="text-4xl font-bold text-navy-700">Nuestra Visión</h2>
            </div>
            <p className="text-lg text-brown-600 leading-relaxed">
              Ser reconocidos como una institución líder en educación, formando ciudadanos competentes y éticos que
              contribuyan al desarrollo sostenible de la sociedad y enfrenten con éxito los desafíos del siglo XXI.
            </p>
          </div>

          {/* Valores */}
          <div className="space-y-6 md:col-span-2">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-beige-500 to-brown-600 flex items-center justify-center rounded-2xl shadow-lg shadow-beige-500/30">
                <svg className="w-8 h-8 text-navy-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <h2 className="text-4xl font-bold text-navy-700">Nuestros Valores</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {[
                "Respeto",
                "Responsabilidad",
                "Honestidad",
                "Solidaridad",
                "Excelencia",
                "Innovación",
                "Compromiso",
                "Integridad",
              ].map((valor) => (
                <div
                  key={valor}
                  className="bg-gradient-to-br from-beige-100 to-beige-200 border-2 border-brown-400 p-6 text-center rounded-xl shadow-md shadow-beige-300/50 hover:shadow-xl hover:shadow-beige-400/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                >
                  <p className="font-bold text-navy-700 text-lg">{valor}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-br from-navy-600 via-navy-700 to-brown-600 text-white grid grid-cols-2 md:grid-cols-4 gap-10 p-12">
          {[
            { value: "25+", label: "Años de experiencia" },
            { value: "500+", label: "Estudiantes activos" },
            { value: "50+", label: "Docentes calificados" },
            { value: "95%", label: "Satisfacción familiar" },
          ].map((stat, index) => (
            <div key={index} className="text-center group">
              <p className="text-5xl font-bold text-coral-400 mb-3 group-hover:scale-110 transition-transform duration-300 inline-block">
                {stat.value}
              </p>
              <p className="text-base mt-3 text-beige-200">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
      {/* </CHANGE> */}
    </main>
  )
}
