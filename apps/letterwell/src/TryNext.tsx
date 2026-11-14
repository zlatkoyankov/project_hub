// "Още нещо за днес" / "Something else for today": shown when a daily game is finished, so players
// who came for the game also find the other daily game and two or three tools that fit the season.
// The picks change with the month in the visitor's browser (the block only renders after a game).
import { ArrowRight } from 'lucide-react'
import { track } from '@zyankov/design-system/analytics'
import { pagePath, type Language } from './seo'

interface Pick { href: string; label: string }

// Months are 1–12. Each season lists tools on the hub people tend to need at that time of year.
const SEASONS: Record<Language, { months: number[]; picks: Pick[] }[]> = {
  bg: [
    { months: [11, 12], picks: [{ href: '/bg/kolko-dni-do/#koleda', label: 'Колко дни до Коледа' }, { href: '/bg/razhod-za-otoplenie/', label: 'Колко струва отоплението' }, { href: '/bg/kalkulator-darva/', label: 'Колко дърва за зимата' }] },
    { months: [1, 2], picks: [{ href: '/bg/pochivni-dni-2027/', label: 'Почивни дни 2027' }, { href: '/bg/razhod-za-otoplenie/', label: 'Колко струва отоплението' }, { href: '/bg/kalkulator-zaplata/', label: 'Заплата бруто и нето' }] },
    { months: [3, 4, 5], picks: [{ href: '/bg/kolko-dni-do/#velikden', label: 'Колко дни до Великден' }, { href: '/bg/pochivni-dni-2027/', label: 'Почивни дни 2027' }, { href: '/bg/kalkulator-boya/', label: 'Колко боя за ремонта' }] },
    { months: [6, 7, 8], picks: [{ href: '/bg/razhod-na-gorivo/', label: 'Колко струва пътят до морето' }, { href: '/bg/kalkulator-klimatik/', label: 'Какъв климатик ми трябва' }, { href: '/bg/kolko-dni-do/', label: 'Колко дни до…' }] },
    { months: [9, 10], picks: [{ href: '/bg/kalkulator-darva/', label: 'Колко дърва за зимата' }, { href: '/bg/razhod-za-otoplenie/', label: 'Колко струва отоплението' }, { href: '/bg/kalkulator-izolatsiya/', label: 'Колко изолация ми трябва' }] },
  ],
  en: [
    { months: [10, 11, 12, 1, 2], picks: [{ href: '/energy-cost-calculator/', label: 'What a heater costs to run' }, { href: '/us-federal-holidays-2027/', label: 'US holidays 2027' }, { href: '/compound-interest-calculator/', label: 'Compound interest' }] },
    { months: [3, 4, 5, 6, 7, 8, 9], picks: [{ href: '/calculators/paint-calculator/', label: 'How much paint you need' }, { href: '/date-calculator/', label: 'Days between dates' }, { href: '/percentage-calculator/', label: 'Percentage calculator' }] },
  ],
}

export function TryNext({ language, current }: { language: Language; current: 'daily' | 'anagram' }) {
  const month = new Date().getMonth() + 1
  const season = SEASONS[language].find((s) => s.months.includes(month)) ?? SEASONS[language][0]
  const other = current === 'daily'
    ? { href: pagePath('anagram', language), label: language === 'bg' ? 'Изиграй и Анаграма на деня' : 'Play today’s Anagram too' }
    : { href: pagePath('daily', language), label: language === 'bg' ? 'Изиграй и Дума на деня' : 'Play Letterwell Daily too' }
  const go = (target: string) => track('try_next', { from: current, to: target, language })
  return (
    <div className="try-next">
      <a className="daily-share try-next__game" href={other.href} onClick={() => go(other.href)}>{other.label} <ArrowRight size={18} /></a>
      <p className="try-next__title">{language === 'bg' ? 'Още нещо за днес' : 'Something else for today'}</p>
      <ul>
        {season.picks.map((pick) => (
          <li key={pick.href}><a href={pick.href} onClick={() => go(pick.href)}>{pick.label}</a></li>
        ))}
      </ul>
    </div>
  )
}
