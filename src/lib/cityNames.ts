// City names by cityId, localized on the frontend since the backend
// only reliably returns numeric cityId for some sessions.
const CITY_NAMES: Record<number, { ka: string; en: string; ru: string }> = {
  1: { ka: 'თბილისი', en: 'Tbilisi', ru: 'Тбилиси' },
  2: { ka: 'ახალციხე', en: 'Akhaltsikhe', ru: 'Ахалцихе' },
};

export function getCityName(cityId: number, cityName: string | undefined, lang: string): string {
  const known = CITY_NAMES[cityId];
  if (known) return known[lang as keyof typeof known] || known.en;
  return cityName || '';
}