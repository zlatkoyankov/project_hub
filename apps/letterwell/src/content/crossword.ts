import type { PageContent } from './types'

export const crosswordContent: PageContent = {
  en: [
    {
      title: 'How to use the crossword helper',
      steps: [
        'Count the squares of the answer and type one character per square. Write the letters you already know and a `?` for every empty square. For a five-letter word with C first and O in the middle, type `c?o??`.',
        'The characters `?`, `_`, `.`, `*`, `-` and a space all mean exactly one unknown letter. A `*` is not a wildcard for “any number of letters”: each one is a single square. Case does not matter, and anything that is not a letter is ignored. A pattern can be up to 20 squares long.',
        '“Must contain” takes letters that have to appear somewhere in the word, in squares you have not filled yet. Each letter is listed once, so you cannot ask for two copies of the same letter.',
        '“Leave out” takes letters you have ruled out. A letter you wrote in the pattern is still allowed in its own square, so leaving out O does not remove words whose O sits where your pattern puts it.',
        'The results are alphabetical. Tap ⓘ next to a word to open links to online dictionaries, and use “Show more” when there are many matches.',
      ],
    },
    {
      title: 'Three worked examples',
      paragraphs: ['These are the real results of this page for the inputs shown, from the English word list described below.'],
      examples: [
        {
          title: 'Pattern c?o?s',
          text: [
            'Five squares, C first, O third and S last. The helper finds 24 words: chocs, chogs, chops, chows, cions, clods, clogs, clons, clops, clots, clous, clows, cloys, coofs, cooks, cools, cooms, coops, coots, crocs, crogs, crops, cross and crows.',
            'That is too many to guess from. Say the crossing words tell you an R is in the answer: put `r` in “Must contain” and 5 words remain: crocs, crogs, crops, cross and crows.',
          ],
        },
        {
          title: 'Pattern c?o?s with letters left out',
          text: [
            'Put `hl` in “Leave out” and the helper drops every word with an H or an L, which leaves 11: cions, coofs, cooks, cooms, coops, coots, crocs, crogs, crops, cross and crows.',
          ],
        },
        {
          title: 'Pattern ??ple',
          text: ['Two gaps and then PLE. The helper finds 6 words: ample, apple, caple, duple, maple and tuple. Some are less common than others. The clue and the crossing letters decide which one fits your grid.'],
        },
      ],
    },
    {
      title: 'Where the words come from, and the limits',
      paragraphs: [
        'The helper matches your pattern against the English word list in this site’s files: about 274,000 words, each written in lower-case letters a to z. The list is MIT-licensed; the licence file next to it credits Sindre Sorhus. We use it as it is and do not claim it is complete or official.',
        'It contains plurals, verb forms and many rare, old or technical words, so a short pattern can return results you have never seen. It has no spaces or hyphens, so crossword answers that are phrases, names, abbreviations or words with apostrophes will not be found. Cryptic crosswords and puzzles with themed entries can use such answers.',
        'The search runs in your browser and nothing you type is sent to a server.',
      ],
    },
    {
      title: 'Strategy: getting more from the pattern (our advice)',
      paragraphs: [
        'This is our own advice, not an official method. Fill in the clues you are sure of first, then use their letters as the known squares of the harder ones. Every crossing letter cuts the list a lot: in the example above, one extra letter took 24 words down to 5.',
        'Use “Must contain” when a clue tells you a letter is there but not where, and “Leave out” for letters you have tried and rejected. Look at the results for the ending and the vowels rather than reading every word. If the list is long, add one more crossing letter before you decide.',
      ],
    },
    {
      title: 'Questions',
      faq: [
        { q: 'Which character do I use for an empty square?', a: 'Use `?`. The characters `_`, `.`, `*`, `-` and a space work too, and each stands for exactly one letter.' },
        { q: 'Can the pattern have more than one unknown in a row?', a: 'Yes. Type one `?` for every empty square, for example `p?z?le`.' },
        { q: 'Why is the answer to my clue not in the list?', a: 'It may be a phrase, a name, an abbreviation or a very new word, or it may use an apostrophe or hyphen. The list has only single words made of the letters a to z.' },
        { q: 'Why do I see strange words?', a: 'The word list is large and general. It includes rare, old and technical words and plurals. Pick the one that fits the clue.' },
        { q: 'Does it work for Bulgarian crosswords?', a: 'Yes. Open the [Bulgarian version](/letterwell/bg/krastoslovitsi/) for a Bulgarian word list.' },
      ],
    },
    {
      title: 'Related tools and articles',
      links: [
        { href: '/blog/how-to-solve-crosswords-faster/', label: 'How to solve crosswords faster: 8 tips', note: 'article' },
        { href: '/letterwell/', label: 'Word finder', note: 'every word from a set of letters' },
        { href: '/letterwell/wordle-solver/', label: 'Wordle helper', note: 'narrow down the answer' },
        { href: '/letterwell/anagram/', label: 'Letterwell Anagram', note: 'a daily six-letter puzzle' },
      ],
    },
  ],
  bg: [
    {
      title: 'Как да ползваш помощника за кръстословици',
      steps: [
        'Преброй квадратчетата на отговора и напиши по един знак за всяко. Пиши буквите, които вече знаеш, и `?` за всяко празно квадратче. За дума от пет букви с К отпред и Л на третото място напиши `к?л??`.',
        'Знаците `?`, `_`, `.`, `*`, `-` и интервалът значат точно една непозната буква. `*` не е „произволен брой букви“: всяка звездичка е едно квадратче. Няма значение дали пишеш с главни или малки, а всичко, което не е буква, се игнорира. Шаблонът може да е до 20 квадратчета.',
        '„Трябва да има“ приема букви, които трябва да са някъде в думата, на още непопълнени места. Всяка буква се брои веднъж, затова не можеш да поискаш две копия на една буква.',
        '„Без буквите“ приема букви, които си отхвърлил. Буква, която си написал в шаблона, е позволена на своето място, затова „без О“ не маха думи, в които О е точно там, където го поставя шаблонът.',
        'Резултатите са по азбучен ред. Натисни ⓘ до дума за връзки към речници и „Покажи още“, когато съвпаденията са много.',
      ],
    },
    {
      title: 'Три примера с истински резултат',
      paragraphs: ['Това са точните резултати на страницата за показаните данни, от българския речник, описан по-долу.'],
      examples: [
        {
          title: 'Шаблон к?л??а',
          text: [
            'Шест квадратчета: К първо, Л трето и А последно. Помощникът намира 12 думи: калина, колега, коледа, колена, колиба, колика, колица, колода, колона, кулата, кулина и кулиса.',
            'Ако пресечните думи ти подскажат, че в отговора няма О, напиши `о` в „Без буквите“ и остават 4 думи: калина, кулата, кулина и кулиса. Ако пък знаеш, че има Ц, напиши `ц` в „Трябва да има“ и остава една дума: колица.',
          ],
        },
        {
          title: 'Шаблон пр??ет',
          text: ['Шест квадратчета и две празни в средата. Помощникът намира 3 думи: прелет, привет и пролет. Ако знаеш, че има Л, остават 2: прелет и пролет. Кое от тях пасва, решава определението или пресичащата се дума.'],
        },
      ],
    },
    {
      title: 'Откъде са думите и какви са границите',
      paragraphs: [
        'Помощникът сверява шаблона с българския речник във файловете на сайта: около 126 500 думи, всяка с малки букви от а до я. Списъкът е с лиценз MIT и е получен от [проекта bayganyu/bulgarian-dictionary](https://github.com/bayganyu/bulgarian-dictionary); лицензът е във файл до списъка. Ползваме го такъв, какъвто е, и не твърдим, че е пълен или официален.',
        'В него има словоформи (членувани и множествено число), редки и специални думи, а понякога и собствени имена и заемки. Няма интервали и тирета, затова отговори, които са изрази, имена на няколко думи, съкращения или думи с тире, няма да бъдат намерени. Криптичните кръстословици и такива с тематични отговори често ги ползват.',
        'Търсенето става в браузъра ти и нищо от написаното не се изпраща към сървър.',
      ],
    },
    {
      title: 'Стратегия: как да извлечеш повече от шаблона (наш съвет)',
      paragraphs: [
        'Това е наш съвет, а не официален метод. Попълни първо определенията, в които си сигурен, и ползвай буквите им като известни квадратчета при по-трудните. Всяка пресечна буква съкращава списъка много: в примера по-горе една допълнителна буква го сви от 12 на 4 думи.',
        'Ползвай „Трябва да има“, когато определението подсказва, че буква е в думата, но не къде, и „Без буквите“ за букви, които си пробвал и отхвърлил. Гледай окончанието и гласните, вместо да четеш всяка дума. Ако списъкът е дълъг, добави още една пресечна буква, преди да решиш.',
      ],
    },
    {
      title: 'Въпроси',
      faq: [
        { q: 'Кой знак ползвам за празно квадратче?', a: 'Ползвай `?`. Работят и `_`, `.`, `*`, `-` и интервал, а всеки от тях е точно една буква.' },
        { q: 'Може ли няколко непознати подред?', a: 'Да. Напиши по един `?` за всяко празно квадратче, например `м?р?`.' },
        { q: 'Защо отговорът на определението ми го няма в списъка?', a: 'Може да е израз, име, съкращение или съвсем нова дума, или да е с тире. Списъкът съдържа само единични думи от букви.' },
        { q: 'Защо виждам странни думи?', a: 'Речникът е голям и общ. В него има редки, специални думи и форми. Избери тази, която пасва на определението.' },
        { q: 'Работи ли за английски кръстословици?', a: 'Да. Отвори [английската версия](/letterwell/crossword-solver/) с английски речник.' },
      ],
    },
    {
      title: 'Свързани инструменти и статии',
      links: [
        { href: '/bg/blog/kak-da-reshavash-krastoslovitsi/', label: 'Как да решаваш кръстословици по-бързо: 8 съвета', note: 'статия' },
        { href: '/letterwell/bg/', label: 'Търсачка за думи', note: 'всички думи от набор букви' },
        { href: '/letterwell/bg/wordle/', label: 'Помощник за Wordle', note: 'стесни отговора' },
        { href: '/letterwell/bg/anagrama-na-denya/', label: 'Анаграма на деня', note: 'ежедневна игра с шест букви' },
      ],
    },
  ],
}
