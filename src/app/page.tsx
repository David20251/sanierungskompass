'use client';

import { useState } from 'react';

export default function Page() {
  // Form state
  const [plz, setPlz] = useState('');
  const [baujahr, setBaujahr] = useState('');
  const [heizung, setHeizung] = useState('');
  const [wohnflaeche, setWohnflaeche] = useState('');
  const [massnahme, setMassnahme] = useState('');
  const [showFoerderungen, setShowFoerderungen] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showPlanFor, setShowPlanFor] = useState<number | null>(null);

  // Dummy-Förderdaten (Beispiele)
  const foerderungen = [
    {
      key: 'heizung',
      title: 'Bundesförderung Heizung',
      summe: 'bis zu 10.000 €',
      details:
        'Förderung für den Austausch alter Öl- und Gasheizungen gegen erneuerbare Systeme (z. B. Wärmepumpe).',
      plan: [
        { label: 'Angebote & Vor-Ort-Check einholen', when: 'Woche 1–2' },
        { label: 'Förderantrag stellen (digital)', when: 'Woche 3' },
        { label: 'Wartezeit Bewilligung', when: 'Woche 4–8' },
        { label: 'Installation & Inbetriebnahme', when: 'Woche 9–12' },
        { label: 'Verwendungsnachweis einreichen', when: 'Woche 13–14' },
      ],
    },
    {
      key: 'fenster',
      title: 'Förderung Wolfenbüttel',
      summe: 'bis zu 8.000 €',
      details:
        'Förderungen für energieeffiziente Fenster (U≤1,0), Fassaden- und Dachdämmung – kombinierbar mit iSFP-Bonus.',
      plan: [
        { label: 'Energiecheck / U-Werte & Flächen erfassen', when: 'Woche 1' },
        { label: 'Angebote von Fachbetrieben einholen', when: 'Woche 2–3' },
        { label: 'Förderantrag & Nachweise vorbereiten', when: 'Woche 4' },
        { label: 'Ausführung (Etappenweise möglich)', when: 'Woche 5–10' },
        { label: 'Abnahme & Nachweis (Fotos/Rechnungen)', when: 'Woche 11' },
      ],
    },
    {
      key: 'nds',
      title: 'Regionale Förderung (Niedersachsen)',
      summe: 'bis zu 3.000 €',
      details:
        'Zuschüsse des Landes oder Landkreises (je nach PLZ) für erneuerbare Heizung, Fenster oder Dämmung – teils ohne Energieberater möglich.',
      plan: [
        { label: 'Programm prüfen (Voraussetzungen/Fristen)', when: 'Woche 1' },
        { label: 'Kostenvoranschlag(e) beilegen & Antrag einreichen', when: 'Woche 2' },
        { label: 'Bewilligung abwarten', when: 'Woche 3–6' },
        { label: 'Maßnahme umsetzen (nach Bewilligung)', when: 'Woche 7–12' },
        { label: 'Verwendungsnachweis / Auszahlung', when: 'Woche 13–14' },
      ],
    },
  ];

  const roadmap = [
    { step: '1. Analyse', info: 'Energieverbrauch checken und erste Potenziale erkennen.' },
    { step: '2. Förderung sichern', info: 'Passende Förderungen beantragen – regional und bundesweit.' },
    { step: '3. Umsetzung', info: 'Maßnahmen umsetzen und langfristig Energiekosten sparen.' },
  ];

  const printPDF = () => window.print();

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
      <section id="home" className="bg-green-50 py-16 text-center px-6 relative">
        <h2 className="text-4xl font-bold mb-4">Damit jedes Zuhause zukunftssicher wird</h2>
        <p className="text-lg mb-6 text-gray-700">
          Dein digitaler Begleiter für Sanierung, Förderungen und Energiekosten-Ersparnis.
        </p>
        <button
          onClick={() => document.getElementById('foerdercheck')?.scrollIntoView({ behavior: 'smooth' })}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
        >
          Jetzt Fördercheck starten
        </button>

        {/* Ely (Igel) */}
        <div className="absolute right-6 bottom-0 w-40">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6f/Cartoon_Hedgehog.svg"
            alt="Ely Igel"
          />
          <div className="bg-white rounded-xl shadow-md p-2 text-sm mt-2">
            Hi, ich bin Ely 🦔 – dein Energiespar-Guide!
          </div>
        </div>
      </section>

      {/* Fördercheck */}
      <section id="foerdercheck" className="py-16 px-6 bg-white max-w-4xl mx-auto w-full">
        <h3 className="text-2xl font-bold mb-6 text-center">Fördercheck</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="border rounded p-2" placeholder="Postleitzahl" value={plz} onChange={(e) => setPlz(e.target.value)} />
          <input className="border rounded p-2" placeholder="Baujahr" value={baujahr} onChange={(e) => setBaujahr(e.target.value)} />
          <input className="border rounded p-2" placeholder="Heizungstyp" value={heizung} onChange={(e) => setHeizung(e.target.value)} />
          <input className="border rounded p-2" placeholder="Wohnfläche (qm)" value={wohnflaeche} onChange={(e) => setWohnflaeche(e.target.value)} />
          <select className="border rounded p-2 md:col-span-2" value={massnahme} onChange={(e) => setMassnahme(e.target.value)}>
            <option value="">Maßnahme auswählen</option>
            <option value="daemmung">Dämmung</option>
            <option value="fenster">Fenster</option>
            <option value="pv">Photovoltaik</option>
            <option value="heizung">Heizung</option>
          </select>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => { setShowFoerderungen(true); setExpanded(null); setShowPlanFor(null); }}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
          >
            Ergebnisse anzeigen
          </button>
        </div>

        {showFoerderungen && (
          <>
            <div className="mt-10 grid gap-4">
              {foerderungen
                .filter(f => massnahme ? (massnahme === 'fenster' ? f.key !== 'heizung' : true) : true) // simple Beispiel-Filter
                .map((f, i) => (
                <div key={f.key} className="shadow-md border rounded-xl p-4 bg-white">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h4 className="font-bold">{f.title}</h4>
                      <p className="text-green-700 font-semibold">{f.summe}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="border px-4 py-2 rounded-lg hover:bg-gray-50"
                        onClick={() => setExpanded(expanded === i ? null : i)}
                      >
                        {expanded === i ? 'Weniger Infos' : 'Mehr Infos'}
                      </button>
                      <button
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                        onClick={() => setShowPlanFor(i)}
                      >
                        Förderplan anzeigen
                      </button>
                    </div>
                  </div>
                  {expanded === i && (
                    <p className="mt-3 text-gray-700">{f.details}</p>
                  )}
                </div>
              ))}
            </div>

            {showPlanFor !== null && (
              <div className="mt-8 p-5 border rounded-xl bg-green-50 text-gray-800">
                <h4 className="font-bold mb-2">Dein Förderplan: {foerderungen[showPlanFor].title}</h4>
                <ul className="list-disc ml-6 space-y-1">
                  {foerderungen[showPlanFor].plan.map((p, idx) => (
                    <li key={idx}><span className="font-medium">{p.when}:</span> {p.label}</li>
                  ))}
                </ul>
                <div className="flex gap-3 mt-4">
                  <button className="border px-4 py-2 rounded-lg hover:bg-gray-50" onClick={() => setShowPlanFor(null)}>
                    Plan schließen
                  </button>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700" onClick={printPDF}>
                    PDF generieren
                  </button>
                </div>
                <p className="text-xs text-gray-600 mt-2">Hinweis: Der PDF-Export nutzt den Druck-Dialog deines Browsers.</p>
              </div>
            )}
          </>
        )}
      </section>

      {/* Roadmap */}
      <section id="roadmap" className="bg-green-50 py-16 px-6">
        <h3 className="text-2xl font-bold mb-6 text-center">Deine Roadmap</h3>
        <div className="relative border-l-2 border-green-500 max-w-3xl mx-auto">
          {roadmap.map((r, i) => (
            <div key={i} className="mb-8 ml-4">
              <div className="absolute w-3 h-3 bg-green-500 rounded-full -left-1.5 mt-2" />
              <h4 className="font-bold">{r.step}</h4>
              <p className="text-gray-700">{r.info}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-700 text-white text-center py-6 mt-auto">
        <h4 className="text-lg font-bold">Bereit für deine Sanierung?</h4>
        <p className="mb-4">Lass dich von Ely 🦔 Schritt für Schritt begleiten.</p>
        <button
          onClick={() => document.getElementById('foerdercheck')?.scrollIntoView({ behavior: 'smooth' })}
          className="bg-white text-green-700 px-6 py-3 rounded-xl"
        >
          Fördercheck starten
        </button>
      </footer>
    </div>
  );
}
