// Household electricity price in Bulgaria from 1 July 2026, built from the KEVR decision so the
// calculators and articles use one number and say whether it includes VAT.
//
// Source (opened and checked 17 Nov 2026): KEVR decision № Ц-13 of 1 July 2026,
// https://www.dker.bg/uploads/reshenia/2026/res-c-13-2026.pdf
//  - section III.1: end-supplier price, without VAT (the same for ЕВН, Електрохолд and ЕНЕРГО-ПРО):
//    day / single rate 92.97 EUR/MWh, night 41.03 EUR/MWh;
//  - section III.2: customers pay network charges on top of III.1, without VAT, by distribution area;
//  - obligations to society price: 0.00 EUR/MWh in the same decision.
// Check: Север area, day = 0.09297 + 0.00018 + 0.00801 + 0.00499 + 0.02312 = 0.12927 EUR/kWh, night
// 0.04103 + 0.0363 = 0.07733. Both equal the prices ENERGO-PRO publishes as "without VAT"
// (https://www.energo-pro.bg/en/novini/kevr-utvrdi-novi-ceni-na-elektroenergiyata-ot-1-yuli-2026-g),
// so that published price already contains the network charges, but not VAT.
// Not checked, so not included: excise duty, any fixed fees of the supplier, free-market contracts.

/** Standard VAT rate in Bulgaria, 20% (europa.eu "VAT rules and rates", checked 17 Nov 2026). */
export const ELECTRICITY_VAT_PERCENT = 20

/** Energy price of the end supplier, EUR/kWh without VAT (KEVR decision, section III.1). */
export const ENERGY_EUR_PER_KWH = { day: 0.09297, night: 0.04103 } as const

/** Network charges paid to ESO (transmission), EUR/kWh without VAT: access 0.00018 + transmission 0.00801. */
export const TRANSMISSION_EUR_PER_KWH = 0.00018 + 0.00801

export type AreaId = 'north' | 'south' | 'west'

/** Distribution area: access price + distribution charge for a household, EUR/kWh without VAT (KEVR decision, section III.2).
 *  The area is the distribution company printed on the bill. ENERGO-PRO = North (its published price matches exactly). */
export const AREAS: Record<AreaId, { label: string; access: number; distribution: number }> = {
  north: { label: 'Електроразпределение Север (ЕНЕРГО-ПРО)', access: 0.00499, distribution: 0.02312 },
  south: { label: 'Електроразпределение Юг', access: 0.00419, distribution: 0.02347 },
  west: { label: 'ЕРМ Запад', access: 0.00347, distribution: 0.02391 },
}

const round = (value: number, digits: number) => Math.round(value * 10 ** digits) / 10 ** digits

/** Price per kWh for a household: energy + transmission + the area's network charges, with or without 20% VAT. */
export function electricityPrice(area: AreaId, tariff: 'day' | 'night', withVat: boolean): number {
  const net = ENERGY_EUR_PER_KWH[tariff] + TRANSMISSION_EUR_PER_KWH + AREAS[area].access + AREAS[area].distribution
  return round(withVat ? net * (1 + ELECTRICITY_VAT_PERCENT / 100) : net, 5)
}
