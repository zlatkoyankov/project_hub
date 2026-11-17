import type { PageContent } from './types'

export const anagramContent: PageContent = {
  en: [
    {
      title: 'Worked examples: same letters, several words',
      paragraphs: [
        'An anagram puzzle can have more than one real word in the same six letters. The examples below are not puzzles from this game: they show, with real results from our dictionary, how the checking and the hints behave. Neither word list is revealed here.',
      ],
      examples: [
        {
          title: 'The letters A B E L S T',
          text: [
            'The dictionary has 7 six-letter words made from exactly these letters: ablest, ablets, bastle, blaest, bleats, stable and tables. If today’s word were “stable” and you typed “tables”, the game would answer that “tables” is also a word from these letters, but today’s is another, and let you try again. Only the word of the day solves the puzzle.',
            'Now the hints. “It starts with S” would settle it at once, because stable is the only one of the seven that starts with S, and tables is the only one with T. “It starts with A” leaves two (ablest and ablets) and “It starts with B” leaves three (bastle, blaest and bleats). Then “It ends with…” separates the rest: ablest ends in T and ablets in S.',
          ],
        },
        {
          title: 'The letters E I L N S T',
          text: ['These six letters make seven words in our dictionary: elints, enlist, inlets, intels, listen, silent and tinsel. Some of them, such as “elints” and “intels”, are rare. The game would report any of them that is not today’s word as another word. You can check any set of letters yourself in the [word finder](/letterwell/) with “Use all letters” switched on.'],
        },
      ],
    },
    {
      title: 'Where the words come from, and the limits',
      paragraphs: [
        'Every daily word is a common six-letter word selected from our own list and checked against Letterwell’s English dictionary. That dictionary is an MIT-licensed list of about 274,000 words (its licence file credits Sindre Sorhus). The list of daily words has 154 entries. When it runs out, it starts again from the beginning, so words come back. New words are only added at the end, so the order of the days never changes.',
        'The dictionary is much larger than the daily list and includes rare and technical words. That is why the game can report “another word” for an arrangement you have never met. We do not claim the dictionary is complete or official. There is no archive of past puzzles: you can reveal yesterday’s word, with links to online dictionaries for its meaning.',
        'Your progress stays in this browser. We do not see your guesses; only simple counts of solves, hints, giving up and shares are recorded.',
      ],
    },
    {
      title: 'More strategy (our advice)',
      paragraphs: [
        'This is our advice, not an official method. Start by counting vowels and consonants: with six letters, two or three vowels is usual, and the consonants then need to be split into groups that can sit together. Try the common word beginnings, such as TH, CH, ST, PR, and the common endings, such as -ER, -LE, -ED, -ING, with the letters you have. Build a short “skeleton” of consonants first, and then drop the vowels in.',
        'Use the hints in order. The first letter is the cheapest. If it leaves two or three plausible words, the last letter usually decides. The three-letter start is the strongest hint, so keep it for when you are really stuck. Pressing Shuffle sometimes helps just because you see the letters in a new order.',
      ],
    },
    {
      title: 'More questions',
      faq: [
        { q: 'Why does the game say “also a word” and not accept it?', a: 'Because the puzzle has one intended word. If your letters make a different real word, the game tells you so, so you do not think the letters are wrong.' },
        { q: 'Do hints break my streak?', a: 'No. Solving with hints keeps the streak. The “No hints” count in your statistics shows how often you solved without them. Showing the word ends the streak.' },
        { q: 'Will words repeat?', a: 'Yes, eventually. The list has 154 words, and after the last one it starts again.' },
        { q: 'Can I play yesterday’s puzzle?', a: 'You can reveal yesterday’s word, but there is no archive of past puzzles to play.' },
        { q: 'Is there a Bulgarian version?', a: 'Yes: [Анаграма на деня](/letterwell/bg/anagrama-na-denya/), with Bulgarian words and dictionaries.' },
      ],
    },
    {
      title: 'Related tools and articles',
      links: [
        { href: '/letterwell/daily/', label: 'Letterwell Daily', note: 'a five-letter word in six tries' },
        { href: '/letterwell/', label: 'Word finder', note: 'every word from your letters' },
        { href: '/blog/find-words-from-letters/', label: 'How to find more words in a jumble of letters', note: 'article' },
        { href: '/letterwell/wordle-solver/', label: 'Wordle helper', note: 'narrow down the answer' },
      ],
    },
  ],
  bg: [
    {
      title: 'Примери: едни и същи букви, няколко думи',
      paragraphs: [
        'От един и същи набор от шест букви може да излезе повече от една истинска дума. Примерите по-долу не са пъзели от играта: показват с истински резултати от речника ни как работят проверката и подсказките. Тук не разкриваме списъка с думите на играта.',
      ],
      examples: [
        {
          title: 'Буквите А А Л Н Т Т',
          text: [
            'Речникът има 3 думи от шест букви точно от тези букви: атлант, талант и тантал. Ако днешната дума беше „талант“ и ти напишеш „тантал“, играта ще отговори, че „тантал“ също е дума от тези букви, но днешната е друга, и ще ти даде да опиташ пак. Пъзелът се решава само с думата на деня.',
            'Сега подсказките. „Първата буква е А“ решава веднага, защото само „атлант“ започва с А. „Първата буква е Т“ оставя две думи: талант и тантал. Тогава „Последната буква е Т“ означава талант, а „Последната буква е Л“ означава тантал.',
          ],
        },
        {
          title: 'Буквите Б Е Л О С Т',
          text: ['Тук речникът има 3 думи: болест, сетбол и стебло. „Първата буква е Б“ означава болест. „Първата буква е С“ оставя две думи, сетбол и стебло, а „Последната буква е О“ показва стебло. Можеш да провериш всеки набор от букви и сам в [търсачката за думи](/letterwell/bg/) с включено „Използвай всички букви“.'],
        },
      ],
    },
    {
      title: 'Откъде са думите и какви са границите',
      paragraphs: [
        'Всяка дума на деня е често срещана дума от шест букви от наш списък, проверена в българския речник на Letterwell. Той е с лиценз MIT и е получен от [проекта bayganyu/bulgarian-dictionary](https://github.com/bayganyu/bulgarian-dictionary). Списъкът със заданията има 143 думи. Когато свърши, започва отначало, така че думите се връщат. Нови думи се добавят само в края, така че редът на дните не се променя.',
        'Речникът е много по-голям от списъка със задания и включва редки и специални думи, а и форми като членувани и множествено число. Затова играта може да ти каже „друга дума“ за подредба, която не си срещал. Не твърдим, че речникът е пълен или официален. Няма архив на минали пъзели: можеш да покажеш вчерашната дума, с връзки към речници за значението ѝ.',
        'Прогресът ти остава в този браузър. Не виждаме опитите ти, записват се само прости броячи на решени пъзели, подсказки, отказвания и споделяния.',
      ],
    },
    {
      title: 'Още стратегия (наш съвет)',
      paragraphs: [
        'Това е наш съвет, а не официален метод. Започни с броене на гласните и съгласните: от шест букви обикновено две или три са гласни, а съгласните трябва да се разпределят в групи, които могат да стоят заедно. Пробвай често срещани начала като ПР-, ПО-, СТ-, ЗА- и окончания като -КА, -ЦА, -НИК, -ИНА, -ОСТ с буквите, които имаш. Първо подреди „скелет“ от съгласни и после вмъкни гласните.',
        'Ползвай подсказките по ред. Първата буква е най-евтината. Ако остави две-три вероятни думи, последната буква обикновено решава. Първите три букви са най-силната подсказка, затова я пази, когато наистина си заседнал. „Разбъркай“ понякога помага само защото виждаш буквите в нов ред.',
      ],
    },
    {
      title: 'Още въпроси',
      faq: [
        { q: 'Защо играта казва „друга дума“, но не я приема?', a: 'Защото пъзелът има една търсена дума. Ако буквите ти образуват друга истинска дума, играта ти го казва, за да не мислиш, че буквите са грешни.' },
        { q: 'Подсказките прекъсват ли серията?', a: 'Не. Ако решиш с подсказки, серията продължава. Броячът „Без подсказки“ в статистиката показва колко пъти си решил без тях. „Покажи думата“ прекъсва серията.' },
        { q: 'Ще се повтарят ли думите?', a: 'Да, с времето. Списъкът има 143 думи и след последната започва отначало.' },
        { q: 'Мога ли да играя вчерашния пъзел?', a: 'Можеш да покажеш вчерашната дума, но няма архив с минали пъзели за игра.' },
        { q: 'Има ли английска версия?', a: 'Да: [Letterwell Anagram](/letterwell/anagram/), с английски думи и речници.' },
      ],
    },
    {
      title: 'Свързани инструменти и статии',
      links: [
        { href: '/letterwell/bg/duma-na-denya/', label: 'Дума на деня', note: 'дума от пет букви с шест опита' },
        { href: '/letterwell/bg/', label: 'Търсачка за думи', note: 'всички думи от твоите букви' },
        { href: '/bg/blog/kak-da-namerish-dumi-ot-bukvi/', label: 'Как да намериш повече думи от букви', note: 'статия' },
        { href: '/letterwell/bg/wordle/', label: 'Помощник за Wordle', note: 'стесни отговора' },
      ],
    },
  ],
}
