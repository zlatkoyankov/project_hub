import type { PageContent } from './types'

export const beeContent: PageContent = {
  en: [
    {
      title: 'How to use the Spelling Bee helper',
      steps: [
        'Type the centre letter in the first box. Every word has to contain it.',
        'Type the other six letters in the second box. If you type a letter twice, or the centre letter again, the extra copy is dropped, because the seven letters of the puzzle are all different.',
        'Read the hint table first. Each row is a first letter, each column a word length, and each cell says how many words start with that letter and have that length. The “Two-letter starts” line counts words by their first two letters, for example PA-62.',
        'Press “Show words” only when you want answers. The words are grouped by length, longest first, and a pangram is marked with a star. The ⓘ button next to a word opens links to online dictionaries.',
        'Changing a letter hides the words again, so a new puzzle never starts with the answers already on screen.',
      ],
    },
    {
      title: 'Two worked examples',
      paragraphs: ['Both examples are the real output of this page for the letters shown. The numbers come from the English word list described below.'],
      examples: [
        {
          title: 'Centre A, other letters L P C I R E (the “Try” button)',
          text: [
            'The helper finds 380 words worth 2,034 points in total, and 7 of them are pangrams: capercaillie, pericarpial, capillaire, paperclip, calliper, caliper and replica.',
            'The hint table shows where the words are: 114 start with P, 91 with C and 71 with A. The two-letter starts say that PA gives 62 words and CA gives 56, so those two beginnings alone cover 118 of the 380.',
            'Some of the words are rare. “Alcaiceria” and “pericarpial” are in the list, and a puzzle may not accept them. That is why the hints come first: you can aim at the groups you are missing without reading the answers.',
          ],
        },
        {
          title: 'How the points add up with the same letters',
          text: [
            '“Pace” has four letters, so it scores 1 point. “Replica” uses all seven letters: 7 points for its length plus 7 for the pangram, 14 in all. “Capercaillie” has twelve letters, so it scores 12 + 7 = 19, the highest word for these letters.',
          ],
        },
      ],
    },
    {
      title: 'Where the words come from, and the limits',
      paragraphs: [
        'The helper checks your letters against the English word list in this site’s files: about 274,000 words, all lower-case letters a to z. The list is MIT-licensed; the licence file next to it credits Sindre Sorhus. We use it as it is and do not claim it is complete or official.',
        'It contains plurals, verb forms and rare, old or technical words, and some names written in lower case. It is therefore longer than the list any puzzle accepts. If your game rejects a word from our results, the lists differ; your letters are not wrong. If our list lacks a word your game accepts, the same is true the other way round.',
      ],
    },
    {
      title: 'The rules and scoring we use',
      bullets: [
        'Seven different letters, one of them the centre letter.',
        'A word needs at least four letters and must contain the centre letter.',
        'Letters can be used more than once.',
        'A pangram uses all seven letters.',
        'Scoring: 1 point for a four-letter word, one point per letter for longer words, plus 7 for a pangram.',
      ],
      paragraphs: ['These are the commonly used rules. A particular puzzle may differ in small ways, for example in which words it accepts.'],
    },
    {
      title: 'Strategy: how to find more words (our advice)',
      paragraphs: [
        'This is general advice from us, not an official rule. Look first for endings such as -ING, -ED, -ER and -LY and for beginnings such as RE-, UN- and IN-; one found word often gives you its relatives. Plurals and other forms count as separate words. Remember that a letter can repeat, so double letters open new words.',
        'Look for the pangram early, because it is worth the most. A long word that uses your least common letters is a good guess.',
      ],
    },
    {
      title: 'Questions',
      faq: [
        { q: 'Do the seven letters have to be different?', a: 'Yes. A puzzle has seven different letters, and the helper removes repeats from what you type. The words themselves may use a letter several times.' },
        { q: 'Why does it list words my game does not accept?', a: 'Our dictionary is a large general list that includes rare and technical words. A game usually accepts fewer. Use the hint counts as an upper bound, not as the exact number.' },
        { q: 'Why does it show no pangram?', a: 'Either the seven letters do not make a seven-letter word in our list, or a letter was mistyped. Check the letters first.' },
        { q: 'Does it work in Bulgarian?', a: 'Yes. Open the [Bulgarian version](/letterwell/bg/spelling-bee/) or use the language menu at the top.' },
      ],
    },
    {
      title: 'Related tools and articles',
      links: [
        { href: '/blog/spelling-bee-tips/', label: 'Spelling Bee tips: more words and the pangram', note: 'article' },
        { href: '/letterwell/', label: 'Word finder', note: 'every word from any set of letters' },
        { href: '/letterwell/crossword-solver/', label: 'Crossword helper', note: 'words by pattern' },
        { href: '/blog/find-words-from-letters/', label: 'How to find more words in a jumble of letters', note: 'article' },
      ],
    },
  ],
  bg: [
    {
      title: 'Как да ползваш помощника за Spelling Bee',
      steps: [
        'Напиши централната буква в първото поле. Всяка дума трябва да я съдържа.',
        'Напиши другите шест букви във второто поле. Ако напишеш буква два пъти или повториш централната, излишното копие се маха, защото седемте букви в играта са различни.',
        'Първо виж таблицата с подсказки. Редовете са първите букви, колоните са дължините на думите, а във всяка клетка пише колко думи започват с тази буква и са толкова дълги. Редът „Първи две букви“ брои думите по първите им две букви, например КА-48.',
        'Натисни „Покажи думите“ само когато искаш отговорите. Думите са групирани по дължина, най-дългите първи, а панграмата е отбелязана със звезда. Бутонът ⓘ до дума отваря връзки към речници.',
        'Щом смениш буква, думите се скриват отново, така че нова игра никога не започва с вече показани отговори.',
      ],
    },
    {
      title: 'Два примера с истински резултат',
      paragraphs: ['И двата примера са точният резултат на тази страница за показаните букви. Числата идват от българския речник, описан по-долу.'],
      examples: [
        {
          title: 'Централна А, другите букви К Т Р Н О И (бутонът „Пробвай“)',
          text: [
            'Помощникът намира 267 думи с общо 1452 точки, а 8 от тях са панграми: кинокритика, кантарион, коронарит, трикратно, картинно, наркотик, арткино и каротин.',
            'Таблицата показва къде са думите: 98 започват с К, 57 с Т и 38 с А. По двойки букви най-много са КА (48) и КО (31). Така започването с КА дава почти пет пъти повече думи от започването с АР.',
            'Част от думите са редки или специални, а речникът включва и форми като членувани и множествено число. Затова подсказките са първи: виждаш в кои групи още ти липсват думи, без да четеш отговорите.',
          ],
        },
        {
          title: 'Как се събират точките със същите букви',
          text: [
            '„Нота“ е от четири букви и носи 1 точка. „Картинно“ има осем букви и е панграма: 8 точки за дължината плюс 7 за панграмата, общо 15. „Кинокритика“ има единайсет букви, затова носи 11 + 7 = 18 и е най-високо оценената дума за тези букви.',
          ],
        },
      ],
    },
    {
      title: 'Откъде са думите и какви са границите',
      paragraphs: [
        'Помощникът сверява буквите ти с българския речник във файловете на сайта: около 126 500 думи, само с малки букви от а до я. Списъкът е с лиценз MIT и е получен от [проекта bayganyu/bulgarian-dictionary](https://github.com/bayganyu/bulgarian-dictionary); лицензът е във файл до списъка. Ползваме го такъв, какъвто е, и не твърдим, че е пълен или официален.',
        'В него има словоформи (членувани и множествено число), редки и специални думи, а понякога и собствени имена и заемки, записани с малки букви. Затова списъкът е по-дълъг от този, който приема дадена игра. Ако играта ти отхвърли дума от нашите резултати, списъците се различават, а не буквите ти са грешни. Възможно е и обратното: играта да приема дума, която я няма при нас.',
        'Търсенето става в браузъра ти. Буквите, които пишеш, не се изпращат никъде, отчита се само, че инструментът е ползван.',
      ],
    },
    {
      title: 'Правилата и точките, които ползваме',
      bullets: [
        'Седем различни букви, една от които е централната.',
        'Думата е поне от четири букви и съдържа централната буква.',
        'Буквите може да се използват повече от веднъж.',
        'Панграма е дума, която ползва и седемте букви.',
        'Точки: 1 за дума от четири букви, по 1 на буква за по-дългите и още 7 за панграма.',
      ],
      paragraphs: ['Това са най-често ползваните правила. Конкретна игра може да се различава в дреболии, например в кои думи приема. Най-известната версия на играта е на английски, а помощникът не зависи от конкретна игра: работи с каквито седем букви въведеш.'],
    },
    {
      title: 'Стратегия: как да намериш повече думи (наш съвет)',
      paragraphs: [
        'Това са общи съвети от нас, а не официално правило. Търси първо окончания като -НЕ, -ИЯ, -ОСТ, -СКИ и -КА и представки като ПРЕ-, ПРО-, ИЗ-, НА- и ПО-. Една намерена дума често дава близките си форми. Множественото число и другите форми се броят за отделни думи. Помни, че буквите може да се повтарят, така че двойните букви отварят нови думи.',
        'Търси панграмата рано, защото носи най-много точки. Добро предположение е дълга дума с най-необичайните ти букви.',
      ],
    },
    {
      title: 'Въпроси',
      faq: [
        { q: 'Трябва ли седемте букви да са различни?', a: 'Да. В играта са седем различни букви, а помощникът маха повторенията от написаното. Самите думи може да ползват буква по няколко пъти.' },
        { q: 'Защо показва думи, които играта ми не приема?', a: 'Речникът ни е голям общ списък с редки и специални думи, а играта обикновено приема по-малко. Броят в подсказките е горна граница, а не точното число.' },
        { q: 'Защо няма панграма?', a: 'Или седемте букви не образуват дума с всички букви в нашия списък, или някоя буква е написана грешно. Провери буквите първо.' },
        { q: 'Може ли с по-малко от седем букви?', a: 'Не. Помощникът чака една централна и шест други букви. За друг набор от букви ползвай [търсачката за думи](/letterwell/bg/).' },
        { q: 'Работи ли на английски?', a: 'Да. Отвори [английската версия](/letterwell/spelling-bee-solver/) или смени езика от менюто горе.' },
      ],
    },
    {
      title: 'Свързани инструменти и статии',
      links: [
        { href: '/bg/blog/saveti-za-spelling-bee/', label: 'Съвети за Spelling Bee: повече думи и панграма', note: 'статия' },
        { href: '/letterwell/bg/', label: 'Търсачка за думи', note: 'всички думи от произволни букви' },
        { href: '/letterwell/bg/krastoslovitsi/', label: 'Помощник за кръстословици', note: 'думи по шаблон' },
        { href: '/bg/blog/kak-da-namerish-dumi-ot-bukvi/', label: 'Как да намериш повече думи от букви', note: 'статия' },
      ],
    },
  ],
}
