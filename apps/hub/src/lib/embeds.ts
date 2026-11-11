// Bulgarian calculators that can be embedded on other sites, by the slug of their page.
// /bg/kalkulator-beton/ is embedded from /bg/vgradi/kalkulator-beton/.
export const EMBED_SLUGS = {
  'kalkulator-beton': 'concrete',
  'kalkulator-chakal': 'gravel',
  'kalkulator-boya': 'paint',
  'kalkulator-plochki': 'tile',
  'kalkulator-laminat': 'flooring',
  'kalkulator-gipsokarton': 'drywall',
  'lepilo-i-fuga': 'adhesive',
  'kalkulator-tapeti': 'wallpaper',
  'zamazka-i-mazilka': 'screed',
  'kalkulator-izolatsiya': 'insulation',
  'kalkulator-tuhli': 'masonry',
  'razhod-za-otoplenie': 'heating',
  'kalkulator-darva': 'firewood',
  'kalkulator-klimatik': 'aircon',
  'kalkulator-protsenti': 'percent',
  'kalkulator-dds': 'vat',
  'leva-v-evro': 'euro',
  'kalkulator-dati': 'dates',
  'kalkulator-kredit': 'loan',
  'kalkulator-zaplata': 'salary',
} as const

export type EmbedKind = (typeof EMBED_SLUGS)[keyof typeof EMBED_SLUGS]

/** The embed path for a calculator page path, e.g. /bg/kalkulator-beton/ → /bg/vgradi/kalkulator-beton/. */
export function embedPath(pagePath: string): string {
  return pagePath.replace(/^\/bg\//, '/bg/vgradi/')
}
