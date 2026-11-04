/** Static illustrated backgrounds ship as ordinary assets in /public/art. */
const art: Record<string, string> = {
  'banquet.svg': '/art/banquet.svg', 'garden.svg': '/art/lotus-garden.svg',
  'hall.svg': '/art/hall.svg', 'market.svg': '/art/market.svg',
  'palace.svg': '/art/moon-palace.svg', 'residence.svg': '/art/residence.svg'
}
export const artFor = (filename: string): string => art[filename] ?? '/art/residence.svg'
