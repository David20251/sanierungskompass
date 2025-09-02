'use client';

import { useMemo, useState } from 'react';

type PlanStep = { label: string; when: string };
type Foerderung = {
  key: string;
  title: string;
  summe: string;     // Kurzinfo
  min?: string;      // Mindestbetrag/Zuschuss
  max?: string;      // Maximalbetrag/Zuschuss
  details: string;   // Beschreibung
  depends?: string;  // Wovon hängt es ab?
  plan: PlanStep[];
  visible?: boolean;
};

export default function Page() {
  // Form state
  const [plz, setPlz] = useState('');
  const [baujahr, setBaujahr] = useState('');
  const [heizung, setHeizung] = useState('');
  const [wohnflaeche, setWohnflaeche] = useState('');
  const [massnahme, setMassnahme] = useState('');
  const [showFoerderungen, setShowFoerderungen] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [expandedDepends, setExpandedDepends] = useState<number | null>(null);
  const [showPlanFor, setShowPlanFor] = useState<number | null>(null);
  const [ellyMessage, setellyMessage] = useState(
    'Hallo, ich bin Elly 🦔 – gib deine Hausdaten ein, ich finde passende Förderungen für dich.'
  );

  // -------- Regionale PLZ-Listen --------
  const PLZ_WF = new Set([
    '38300','38302','38304','38312','38315','38317','38319','38321','38322','38324'
  ]);
  const PLZ_BS = new Set([
    '38100','38102','38104','38106','38108','38110','38112','38114','38116','38118','38120','38122','38124','38126'
  ]);
  const PLZ_WOB = new Set(['38440','38442','38444','38446','38448']);

  const cleanPLZ = plz.trim();
  const inWF = PLZ_WF.has(cleanPLZ);
  const inBS = PLZ_BS.has(cleanPLZ);
  const inWOB = PLZ_WOB.has(cleanPLZ);

  // Heizungstyp normalisieren
  const heatType = useMemo(() => {
    const h = heizung.toLowerCase();
    if (/(öl|oel)/.test(h)) return 'oel';
    if (/gas/.test(h)) return 'gas';
    if (/(wärmepumpe|waermepumpe|wp)/.test(h)) return 'wp';
    if (/(pellet|biomasse)/.test(h)) return 'biomasse';
    return 'other';
  }, [heizung]);

  // Basis-Förderungen inkl. Min/Max + Abhängigkeiten
  const allFoerderungen = useMemo<Foerderung[]>(() => {
    const kfwDetailByHeat: Record<string, string> = {
      oel: 'KfW-Programm: Austausch alter Ölheizung gegen erneuerbare Systeme (z. B. Wärmepumpe, Biomasse) inkl. Umfeldmaßnahmen.',
      gas: 'KfW-Programm: Austausch Gasheizung gegen erneuerbare Systeme inkl. Speicher & Heizungsoptimierung.',
      wp: 'KfW-Programm: Einbau/Optimierung von Wärmepumpen inkl. Effizienzmaßnahmen.',
      biomasse: 'KfW-Programm: Biomasse-/Pelletheizung (Emissionsgrenzwerte beachten) inkl. Umfeldmaßnahmen.',
      other: 'KfW-Programm: Erneuerbare Heizung & Umfeldmaßnahmen – abhängig von Ausgangslage.',
    };

    const list: Foerderung[] = [
      // Heizung (KfW)
      {
        key: 'kfw-heizung',
        title: 'KfW – Heizungsförderung (erneuerbar)',
        summe: 'Bis ca. 15.000 €',
        details: kfwDetailByHeat[heatType],
        depends:
          'Haushaltseinkommen, Ausgangsheizung (Öl/Gas), Effizienz der neuen Anlage (z. B. JAZ bei WP), Umfeldmaßnahmen, ggf. Kombi mit Landes-/Kommunalprogrammen.',
        plan: [
          { label: 'Angebote & Vor-Ort-Check', when: 'Woche 1–2' },
          { label: 'Förderantrag online (vor Auftrag)', when: 'Woche 3' },
          { label: 'Bewilligung abwarten', when: 'Woche 4–8' },
          { label: 'Installation & Inbetriebnahme', when: 'Woche 9–12' },
          { label: 'Verwendungsnachweis / Auszahlung', when: 'Woche 13–14' },
        ],
      },

      // Gebäudehülle (BAFA) – Fenster & Dämmung
      {
        key: 'bafa-gebaeudehuelle',
        title: 'BAFA – Gebäudehülle (Fenster & Dämmung)',
        summe: '15 % (mit iSFP 20 %)',
        details:
          'Förderung u. a. für Fenster mit sehr guten U-Werten sowie Fassaden-/Dach-/Kellerdämmung. iSFP-Bonus erhöht den Satz von 15 % auf 20 %. typ. mind. ca. 1.500 € und max. 15.000 €',
        depends:
          'U-Werte/Technikstandard, förderfähige Flächen/Einheiten, iSFP vorhanden, Kombination mit regionalen Zuschüssen, Maximalbeträge je Bauteil.',
        plan: [
          { label: 'Flächen & U-Werte erfassen, Angebote einholen', when: 'Woche 1–2' },
          { label: 'Antrag vorbereiten & einreichen', when: 'Woche 3' },
          { label: 'Bewilligung abwarten', when: 'Woche 4–6' },
          { label: 'Ausführung (ggf. etappenweise)', when: 'Woche 7–12' },
          { label: 'Rechnungen & Nachweise einreichen', when: 'Woche 13–14' },
        ],
      },

      // Region Niedersachsen
      {
        key: 'nds-regional',
        title: 'Regionale Förderung (Niedersachsen)',
        summe: 'programmabhängig, Bis ca. 5.000 €',
        min: 'typ. mind. ca. 500 €',
        details:
          'Zuschüsse durch Land/Kreise/Kommunen für Heizung, Fenster oder Dämmung. Oft kombinierbar mit Bundesförderungen.',
        depends:
          'Regionale Richtlinie, Budget/Fristen, Maßnahme (Heizung/Hülle), ggf. soziale Kriterien, Kombination mit Bundesmitteln.',
        plan: [
          { label: 'Programme prüfen (PLZ, Richtlinie, Fristen)', when: 'Woche 1' },
          { label: 'Angebote & Nachweise sammeln', when: 'Woche 2' },
          { label: 'Antrag einreichen', when: 'Woche 3' },
          { label: 'Bewilligung abwarten', when: 'Woche 4–6' },
          { label: 'Umsetzung & Nachweis', when: 'Woche 7–12' },
        ],
      },

      // Wolfenbüttel
      {
        key: 'wf-spezial',
        title: 'Stadt/Landkreis Wolfenbüttel – kommunale Programme',
        summe: 'programmabhängig, bis ca. 3000 €',
        details:
          'Zuschüsse für Sanierungen in Wolfenbüttel (Fenster, Dämmung, Heizung – abhängig vom Programmstand). Teilweise ohne Energieberater beantragbar.',
        depends:
          'Konkrete kommunale Richtlinie, förderfähige Maßnahmen/Standards, PLZ, Fristen/Budget; teils Kombi mit BAFA/KfW möglich.',
        plan: [
          { label: 'Richtlinie & Fristen prüfen', when: 'Woche 1' },
          { label: 'Angebote einholen & Antrag vorbereiten', when: 'Woche 2' },
          { label: 'Einreichen & Bewilligung abwarten', when: 'Woche 3–6' },
          { label: 'Umsetzung starten', when: 'Woche 7–12' },
          { label: 'Nachweise einreichen & Auszahlung', when: 'Woche 13–14' },
        ],
      },

      // Braunschweig
      {
        key: 'bs-spezial',
        title: 'Stadt Braunschweig – kommunale Programme',
        summe: 'programmabhängig, Bis ca. 3000 €',
        details:
          'Kommunale Zuschüsse/Boniprogramme für energetische Sanierungen (z. B. Hülle/Heizung). Bedingungen je nach Programm.',
        depends:
          'Aktuelle Richtlinie der Stadt, Technikstandard/U-Werte, Antragszeitraum, ggf. soziale Kriterien; kombinierbar mit Bundesförderung.',
        plan: [
          { label: 'Kommunale Infos prüfen', when: 'Woche 1' },
          { label: 'Nachweise & Angebote zusammentragen', when: 'Woche 2' },
          { label: 'Antrag stellen', when: 'Woche 3' },
          { label: 'Umsetzung starten', when: 'Woche 4–10' },
          { label: 'Nachweise hochladen & Auszahlung', when: 'Woche 11–12' },
        ],
      },

      // Wolfsburg
      {
        key: 'wob-spezial',
        title: 'Stadt Wolfsburg – kommunale Programme',
        summe: 'programmabhängig, bis ca. 3000 €',
        details:
          'Förderprogramme der Stadt Wolfsburg für energetische Sanierungen (Gebäudehülle/Heizung). Details je nach Programmstand.',
        depends:
          'Richtlinie (Voraussetzungen, Fristen), technisch geforderte Standards, verfügbare Budgets, Kombinationsmöglichkeiten.',
        plan: [
          { label: 'Förderrichtlinie lesen & Voraussetzungen prüfen', when: 'Woche 1' },
          { label: 'Angebote einholen & Antrag vorbereiten', when: 'Woche 2' },
          { label: 'Antrag einreichen', when: 'Woche 3' },
          { label: 'Umsetzung starten', when: 'Woche 4–10' },
          { label: 'Nachweise einreichen & Auszahlung', when: 'Woche 11–12' },
        ],
      },
    ];

    // Sichtbarkeit steuern
    return list
      .map((f) => {
        let visible = true;

        if (massnahme === 'heizung') {
          visible = ['kfw-heizung', 'nds-regional', 'wf-spezial', 'bs-spezial', 'wob-spezial'].includes(f.key);
        } else if (massnahme === 'fenster' || massnahme === 'daemmung') {
          visible = ['bafa-gebaeudehuelle', 'nds-regional', 'wf-spezial', 'bs-spezial', 'wob-spezial'].includes(f.key);
        } else if (massnahme === 'pv') {
          visible = ['nds-regional', 'wf-spezial', 'bs-spezial', 'wob-spezial'].includes(f.key);
        }

        // Kommunale Programme nur bei passender PLZ
        if (f.key === 'wf-spezial' && !inWF) visible = false;
        if (f.key === 'bs-spezial' && !inBS) visible = false;
        if (f.key === 'wob-spezial' && !inWOB) visible = false;

        return { ...f, visible };
      })
      .filter((f) => f.visible);
  }, [massnahme, inWF, inBS, inWOB, heatType]);

  const printPDF = () => window.print();

  const handleShowResults = () => {
    setShowFoerderungen(true);
    setExpanded(null);
    setExpandedDepends(null);
    setShowPlanFor(null);
    setellyMessage(
      'Super! 🦔  Hier sind deine passenden Förderungen. Klicke auf „Mehr Infos“, „Wovon hängt das ab?“ oder lass dir direkt einen Förderplan erzeugen.'
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header (unverändert lassen) */}
      <header className="w-full bg-green-700 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold">SanierungsKompass</h1>
      </header>

      {/* Hero + kompakter Fahrplan */}
      <section id="home" className="bg-green-50 py-16 text-center px-6 relative">
        <h2 className="text-4xl font-bold mb-4">Förderungen endlich verständlich</h2>
        <p className="text-lg mb-6 text-gray-700">
          Dein digitaler Begleiter für Sanierung, Förderungen und Energiekosten-Ersparnis.
        </p>
        <button
          onClick={() => document.getElementById('foerdercheck')?.scrollIntoView({ behavior: 'smooth' })}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
        >
          Jetzt Fördercheck starten
        </button>

        {/* Elly – Sprechblase (global, fixed) */}
        <div className="fixed right-4 bottom-4 z-50 max-w-xs">
          <div className="bg-white rounded-xl shadow-lg p-3 text-sm border">
            {ellyMessage}
          </div>
        </div>


        {/* Mini-Fahrplan direkt auf der Startseite */}
        <div className="mt-10 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          {[
            { t: '1. Eingeben', d: 'PLZ, Baujahr, Heizung, Maßnahme wählen.' },
            { t: '2. Förderungen sehen', d: 'Bund/Land/Kommune auf einen Blick – mit Beträgen.' },
            { t: '3. Plan erhalten', d: 'Zeitachse & To-dos – auf Wunsch als PDF.' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-xl border p-4 shadow-sm">
              <h4 className="font-semibold mb-1">{s.t}</h4>
              <p className="text-sm text-gray-700">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Fördercheck */}
      <section id="foerdercheck" className="py-16 px-6 bg-white max-w-4xl mx-auto w-full">
        <h3 className="text-2xl font-bold mb-6 text-center">Fördercheck</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="border rounded p-2" placeholder="Postleitzahl" value={plz} onChange={(e) => setPlz(e.target.value)} />
          <input className="border rounded p-2" placeholder="Baujahr" value={baujahr} onChange={(e) => setBaujahr(e.target.value)} />
          <input className="border rounded p-2" placeholder="Heizungstyp (Öl, Gas, Wärmepumpe, Biomasse)" value={heizung} onChange={(e) => setHeizung(e.target.value)} />
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
            onClick={handleShowResults}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
          >
            Ergebnisse anzeigen
          </button>
        </div>

        {showFoerderungen && (
          <>
            <div className="mt-10 grid gap-4">
              {allFoerderungen.map((f, i) => (
                <div key={f.key} className="shadow-md border rounded-xl p-4 bg-white">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h4 className="font-bold">{f.title}</h4>
                      <p className="text-green-700 font-semibold">{f.summe}</p>
                      {(f.min || f.max) && (
                        <p className="text-sm text-gray-700">
                          {f.min ? `Min.: ${f.min}` : ''}{f.min && f.max ? ' · ' : ''}{f.max ? `Max.: ${f.max}` : ''}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="border px-4 py-2 rounded-lg hover:bg-gray-50"
                        onClick={() => setExpanded(expanded === i ? null : i)}
                      >
                        {expanded === i ? 'Weniger Infos' : 'Mehr Infos'}
                      </button>
                      <button
                        className="border px-4 py-2 rounded-lg hover:bg-gray-50"
                        onClick={() => setExpandedDepends(expandedDepends === i ? null : i)}
                      >
                        {expandedDepends === i ? 'Weniger Abhängigkeiten' : 'Wovon hängt das ab?'}
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

                  {expandedDepends === i && f.depends && (
                    <div className="mt-3 p-3 bg-green-50 border rounded-lg text-gray-800">
                      <p className="text-sm">{f.depends}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {showPlanFor !== null && (
              <div className="mt-8 p-5 border rounded-xl bg-green-50 text-gray-800">
                <h4 className="font-bold mb-2">Dein Förderplan: {allFoerderungen[showPlanFor].title}</h4>
                <ul className="list-disc ml-6 space-y-1">
                  {allFoerderungen[showPlanFor].plan.map((p, idx) => (
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
      {/* Footer */}
      <footer className="bg-green-700 text-white text-center py-6 mt-auto">
        <p className="text-sm mb-2">
          © {new Date().getFullYear()} SanierungsKompass – damit dein Zuhause zukunftssicher wird
        </p>
        <div className="flex justify-center gap-6 text-sm">
          <a href="#" className="hover:underline">Impressum</a>
          <a href="#" className="hover:underline">Datenschutz</a>
          <a href="#foerdercheck" className="hover:underline">Fördercheck starten</a>
        </div>
      </footer>

    </div>
  );
}
