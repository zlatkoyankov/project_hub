import type { APIRoute } from 'astro'
import { daysOff } from '../../lib/holidays'

// Calendar file with the official days off in 2027, for Google Calendar, Outlook and Apple Calendar.
export const GET: APIRoute = () => {
  const stamp = '20261111T000000Z'
  const events = daysOff(2027).map((day) => {
    const start = day.date.replaceAll('-', '')
    const end = new Date(Date.parse(`${day.date}T00:00:00Z`) + 86_400_000).toISOString().slice(0, 10).replaceAll('-', '')
    return ['BEGIN:VEVENT', `UID:${start}-pochiven-den@zyankov.eu`, `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${start}`, `DTEND;VALUE=DATE:${end}`, `SUMMARY:${day.name.replaceAll(',', '\\,')}`, 'TRANSP:TRANSPARENT', 'END:VEVENT'].join('\r\n')
  })
  const body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//zyankov.eu//Pochivni dni 2027//BG', 'CALSCALE:GREGORIAN', 'X-WR-CALNAME:Почивни дни 2027', ...events, 'END:VCALENDAR', ''].join('\r\n')
  return new Response(body, { headers: { 'Content-Type': 'text/calendar; charset=utf-8' } })
}
