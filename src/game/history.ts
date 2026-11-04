/** Compact reign-year reference for historical campaign context.
 * Exact accession months are used for the selected opening years where known.
 * Most other transitions are year-granular due to the simplified 360-day game calendar.
 */
const reigns = [
  [1392, 7, 'King Taejo'],
  [1398, 1, 'King Jeongjong'],
  [1400, 1, 'King Taejong'],
  [1418, 1, 'King Sejong'],
  [1450, 1, 'King Munjong'],
  [1452, 1, 'King Danjong'],
  [1455, 1, 'King Sejo'],
  [1468, 1, 'King Yejong'],
  [1469, 1, 'King Seongjong'],
  [1494, 12, 'Yeonsangun'],
  [1506, 1, 'King Jungjong'],
  [1544, 1, 'King Injong'],
  [1545, 1, 'King Myeongjong'],
  [1567, 1, 'King Seonjo'],
  [1608, 1, 'Gwanghaegun'],
  [1623, 1, 'King Injo'],
  [1649, 1, 'King Hyojong'],
  [1659, 1, 'King Hyeonjong'],
  [1674, 1, 'King Sukjong'],
  [1720, 1, 'King Gyeongjong'],
  [1724, 1, 'King Yeongjo'],
  [1776, 4, 'King Jeongjo'],
  [1800, 8, 'King Sunjo'],
  [1834, 1, 'King Heonjong'],
  [1849, 1, 'King Cheoljong'],
  [1863, 12, 'King Gojong'],
  [1907, 1, 'King Sunjong']
] as const

export function historicalMonarch(year: number, month: number): string {
  let name = 'King Taejo'
  for (const [reignYear, reignMonth, monarch] of reigns) {
    if (year > reignYear || (year === reignYear && month >= reignMonth)) name = monarch
    else break
  }
  return name
}
