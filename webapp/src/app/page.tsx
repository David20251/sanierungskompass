'use client';
export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full bg-green-700 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold">KlimaKompass</h1>
        <nav className="space-x-6 text-sm">
          <a href="#home" className="hover:underline">Home</a>
          <a href="#foerdercheck" className="hover:underline">Fördercheck</a>
          <a href="#roadmap" className="hover:underline">Roadmap</a>
          <a href="#about" className="hover:underline">Über uns</a>
        </nav>
      </header>

      {/* Hero */}
      <section id="home" className="bg-green-50 py-16 text-center px-6">
        <h2 className="text-4xl font-bold mb-4">Damit jedes Zuhause zukunftssicher wird</h2>
        <p className="text-lg mb-6 text-gray-700">
          Dein digitaler Begleiter für Sanierung, Förderungen und Energiekosten-Ersparnis.
        </p>
        <button
          onClick={() => document.getElementById("foerdercheck")?.scrollIntoView({ behavior: "smooth" })}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
        >
          Jetzt Fördercheck starten
        </button>
      </section>

      {/* Fördercheck */}
      <section id="foerdercheck" className="py-16 px-6 bg-white max-w-4xl mx-auto w-full">
        <h3 className="text-2xl font-bold mb-6 text-center">Fördercheck</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="border rounded p-2" placeholder="Postleitzahl" />
          <input className="border rounded p-2" placeholder="Baujahr" />
          <input className="border rounded p-2" placeholder="Heizungstyp" />
          <input className="border rounded p-2" placeholder="Wohnfläche (qm)" />
          <select className="border rounded p-2 md:col-span-2">
            <option>Maßnahme auswählen</option>
            <option>Dämmung</option>
            <option>Fenster</option>
            <option>Photovoltaik</option>
            <option>Heizung</option>
          </select>
        </div>
        <div className="text-center mt-6">
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl">
            Ergebnisse anzeigen
          </button>
        </div>
      </section>

      {/* Roadmap */}
      <section id="roadmap" className="bg-green-50 py-16 px-6">
        <h3 className="text-2xl font-bold mb-6 text-center">Deine Roadmap</h3>
        <div className="relative border-l-2 border-green-500 max-w-3xl mx-auto">
          {["Analyse", "Förderung sichern", "Umsetzung"].map((step, i) => (
            <div key={i} className="mb-8 ml-4">
              <div className="absolute w-3 h-3 bg-green-500 rounded-full -left-1.5 mt-2"></div>
              <h4 className="font-bold">{i + 1}. {step}</h4>
              <p className="text-gray-700">Kurzbeschreibung des Schrittes.</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-700 text-white text-center py-6 mt-auto">
        <h4 className="text-lg font-bold">Bereit für deine Sanierung?</h4>
        <p className="mb-4">Starte jetzt deinen Fördercheck.</p>
        <button
          onClick={() => document.getElementById("foerdercheck")?.scrollIntoView({ behavior: "smooth" })}
          className="bg-white text-green-700 px-6 py-3 rounded-xl"
        >
          Fördercheck starten
        </button>
      </footer>
    </div>
  );
}
