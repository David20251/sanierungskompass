// src/lib/foerderDaten.ts

// Typen auslagern
export type PlanStep = { label: string; when: string };

export type Foerderung = {
  key: string;
  title: string;
  summe: string;
  details: string;
  depends?: string;
  advisorCostHint?: string;
  plan: PlanStep[];
  visible?: boolean;
};

// PLZ-„Datenbank“ auslagern
export const PLZ_WF = new Set([
  '38300','38302','38304','38312','38315','38317','38319','38321','38322','38324'
]);

export const PLZ_BS = new Set([
  '38100','38102','38104','38106','38108','38110','38112','38114',
  '38116','38118','38120','38122','38124','38126'
]);

export const PLZ_WOB = new Set(['38440','38442','38444','38446','38448']);

// zentrale Funktion, die dir alle Förderungen nach Filter zurückgibt
export function buildFoerderungen(params: {
  massnahme: string;
  inWF: boolean;
  inBS: boolean;
  inWOB: boolean;
  heatType: 'oel' | 'gas' | 'wp' | 'biomasse' | 'other';
}): Foerderung[] {
  const { massnahme, inWF, inBS, inWOB, heatType } = params;

  const kfwDetailByHeat: Record<string, string> = {
    oel: 'KfW-Programm: Austausch alter Ölheizung gegen erneuerbare Systeme (z. B. Wärmepumpe, Biomasse) inkl. Umfeldmaßnahmen.',
    gas: 'KfW-Programm: Austausch Gasheizung gegen erneuerbare Systeme inkl. Speicher & Heizungsoptimierung.',
    wp: 'KfW-Programm: Einbau/Optimierung von Wärmepumpen inkl. Effizienzmaßnahmen.',
    biomasse: 'KfW-Programm: Biomasse-/Pelletheizung (Emissionsgrenzwerte beachten) inkl. Umfeldmaßnahmen.',
    other: 'KfW-Programm: Erneuerbare Heizung & Umfeldmaßnahmen – abhängig von Ausgangslage.',
  };

  // ⬇️ HIER kommt jetzt deine komplette Förderlisten-Logik rein,
  // die du bisher in page.tsx in allFoerderungen drin hattest:
  const list: Foerderung[] = [
    // z.B.:
    // {
    //   key: 'kfw-heizung',
    //   title: 'KfW – Heizungsförderung (erneuerbar)',
    //   summe: 'Bis ca. 15.000 €',
    //   details: kfwDetailByHeat[heatType],
    //   advisorCostHint: 'Energieberater (Richtwert): ca. 400–1.200 € …',
    //   depends: 'Haushaltseinkommen, Ausgangsheizung, …',
    //   plan: [ ... ]
    // },
    // ... alle deine anderen Förderobjekte (BAFA, Niedersachsen, WF, BS, WOB, Bad)
  ];

  // Sichtbarkeit wie bisher
  return list
    .map((f) => {
      let visible = true;

      if (massnahme === 'heizung') {
        visible = ['kfw-heizung', 'nds-regional', 'wf-spezial', 'bs-spezial', 'wob-spezial'].includes(f.key);
      } else if (massnahme === 'fenster' || massnahme === 'daemmung') {
        visible = ['bafa-gebaeudehuelle', 'nds-regional', 'wf-spezial', 'bs-spezial', 'wob-spezial'].includes(f.key);
      } else if (massnahme === 'pv') {
        visible = ['nds-regional', 'wf-spezial', 'bs-spezial', 'wob-spezial'].includes(f.key);
      } else if (massnahme === 'bad') {
        visible = ['bad-barrierefrei', 'nds-regional', 'wf-spezial', 'bs-spezial', 'wob-spezial'].includes(f.key);
      }

      if (f.key === 'wf-spezial' && !inWF) visible = false;
      if (f.key === 'bs-spezial' && !inBS) visible = false;
      if (f.key === 'wob-spezial' && !inWOB) visible = false;

      return { ...f, visible };
    })
    .filter((f) => f.visible);
}
