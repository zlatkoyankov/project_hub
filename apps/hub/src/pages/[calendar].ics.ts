import type { APIRoute, GetStaticPaths } from 'astro'
import { UK_REGIONS, ukBankHolidays, usFederalHolidays, type Holiday } from '../lib/holidays-en'

// Calendar files for the US and UK holiday pages: /us-federal-holidays-2027.ics, /uk-bank-holidays-2027-scotland.ics, …
const YEAR = 2027

export const getStaticPaths: GetStaticPaths = () => [
  { params: { calendar: `us-federal-holidays-${YEAR}` }, props: { name: `US federal holidays ${YEAR}`, list: usFederalHolidays(YEAR) } },
  ...UK_REGIONS.map((region) => ({ params: { calendar: `uk-bank-holidays-${YEAR}-${region.id}` }, props: { name: `Bank holidays ${YEAR}: ${region.name}`, list: ukBankHolidays(YEAR, region.id) } })),
]

export const GET: APIRoute = ({ params, props }) => {
  const { name, list } = props as { name: string; list: Holiday[] }
  const events = list.map((holiday) => {
    const start = holiday.date.replaceAll('-', '')
    const end = new Date(Date.parse(`${holiday.date}T00:00:00Z`) + 86_400_000).toISOString().slice(0, 10).replaceAll('-', '')
    return ['BEGIN:VEVENT', `UID:${start}-${params.calendar}@zyankov.eu`, 'DTSTAMP:20261111T000000Z', `DTSTART;VALUE=DATE:${start}`, `DTEND;VALUE=DATE:${end}`, `SUMMARY:${holiday.name.replaceAll(',', '\\,')}`, 'TRANSP:TRANSPARENT', 'END:VEVENT'].join('\r\n')
  })
  const body = ['BEGIN:VCALENDAR', 'VERSION:2.0', `PRODID:-//zyankov.eu//${params.calendar}//EN`, 'CALSCALE:GREGORIAN', `X-WR-CALNAME:${name}`, ...events, 'END:VCALENDAR', ''].join('\r\n')
  return new Response(body, { headers: { 'Content-Type': 'text/calendar; charset=utf-8' } })
}
