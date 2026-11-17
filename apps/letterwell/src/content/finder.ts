import type { PageContent } from './types'

export const finderContent: PageContent = {
  en: [
    {
      title: 'How to use the word finder',
      steps: [
        'Type up to 16 letters in the box. Only the letters a to z are kept. You can also press “Randomize” for random letters, or tap one of the “Try these” examples.',
        'Optionally open the settings. “Word length” sets the shortest and longest word (2 to 12 letters by default). “Starts with”, “Ends with” and “Contains” each take one of your own letters. “Use all letters” looks for exact anagrams and fixes the length to the number of letters you typed.',
        'Press “Find words”. The results are sorted longest first, or A to Z if you choose that. Tap a length chip to see only words of that length, press “Show more words” to see the next 72, and use Copy to copy a word.',
        'Switch on Scrabble, Words With Friends or Boggle scores if you want to compare plays. The scores appear next to each word.',
      ],
    },
    {
      title: 'Three worked examples',
      paragraphs: ['These are the real results of this page for the settings shown, from the English word list described below.'],
      examples: [
        {
          title: 'The letters triangle, default settings',
          text: ['The finder lists 455 words made from these eight letters, each letter used no more often than you typed it. By length: 23 words of two letters, 81 of three, 144 of four, 102 of five, 69 of six, 29 of seven and 7 of eight. A letter that appears once can only be used once, so “tingle” fits but “tinning” does not.'],
        },
        {
          title: 'The letters triangle with “Use all letters”',
          text: ['Now only words that use every letter qualify. There are 7: alerting, altering, integral, relating, tanglier, teraglin and triangle itself. Several are rare, which is normal for a large dictionary.'],
        },
        {
          title: 'The letters stream, “Starts with S”, shortest word 5',
          text: ['This leaves 8 words: stream, satem, smart, smear, stare, steam, stear and strae. The same rack without filters gives 154 words, so the filters help a lot when you already know part of the word.'],
        },
      ],
    },
    {
      title: 'Where the words come from, and the limits',
      paragraphs: [
        'The finder uses the English word list in this site’s files: about 274,000 words, all in lower-case letters a to z. The list is MIT-licensed; the licence file next to it credits Sindre Sorhus. We use it as it is, and we do not claim it is complete or official.',
        'It includes plurals, verb forms, rare, old and technical words, and some names written in lower case. It is not the dictionary of any particular game, so a result may be refused by your game, and a word your game accepts may be missing here. Check the rules and the dictionary of the game you play.',
        'There is no blank tile or wildcard: each letter must be one you typed. If you know the pattern of a word, use the [crossword helper](/letterwell/crossword-solver/). Searches run in your browser. The letters you type are not sent to a server; only the number of letters and results is counted. Recent searches stay in the page and disappear when you reload.',
      ],
    },
    {
      title: 'How the scores are worked out',
      bullets: [
        'Scrabble and Words With Friends: the sum of the letter values (English tile values, listed in the code of this page). Premium squares and bonuses are not included, and editions of the games may differ.',
        'Boggle: by word length. Words of 3 or 4 letters score 1, five letters 2, six letters 3, seven letters 5, and eight or more 11. Shorter words score 0.',
        'Example: “triangle” is worth 9 Scrabble points, 12 Words With Friends points and 11 Boggle points.',
      ],
    },
    {
      title: 'Strategy: finding more words (our advice)',
      paragraphs: [
        'This is our advice, not an official method. Use the length chips to look for the longest words first, then work down. Try common endings (-ING, -ED, -ER) and beginnings (RE-, UN-, IN-) with your letters. Use “Starts with” and “Ends with” to test one idea at a time. Switch on “Use all letters” to see whether your whole rack makes a word. If you are playing for points, compare the scores of two or three candidates rather than always taking the longest.',
      ],
    },
    {
      title: 'Questions',
      faq: [
        { q: 'Can I use a blank tile or a wildcard?', a: 'No. Every letter in a result is one you typed. For a word with known letters and gaps, use the [crossword helper](/letterwell/crossword-solver/).' },
        { q: 'Why does it show a word my game does not accept?', a: 'Our dictionary is a large general list, not the list of any specific game. Check the word in your game’s own dictionary.' },
        { q: 'Does it find anagrams?', a: 'Yes. Switch on “Use all letters”. For a daily six-letter puzzle, try [Letterwell Anagram](/letterwell/anagram/).' },
        { q: 'Does it work in Bulgarian?', a: 'Yes. Open the [Bulgarian word finder](/letterwell/bg/) or use the language menu. It uses a Bulgarian word list and Bulgarian Scrabble letter values.' },
      ],
    },
    {
      title: 'Related tools and articles',
      links: [
        { href: '/blog/find-words-from-letters/', label: 'How to find more words in a jumble of letters', note: 'article' },
        { href: '/letterwell/wordle-solver/', label: 'Wordle helper', note: 'narrow down the answer' },
        { href: '/letterwell/crossword-solver/', label: 'Crossword helper', note: 'words by pattern' },
        { href: '/letterwell/spelling-bee-solver/', label: 'Spelling Bee helper', note: 'hints, words and pangrams' },
      ],
    },
  ],
  bg: [
    {
      title: 'Как да ползваш търсачката за думи',
      steps: [
        'Напиши до 16 букви в полето. Остават само българските букви от а до я. Можеш да натиснеш и „Разбъркай“ за случайни букви или някой от примерите „Пробвай тези“.',
        'По желание отвори настройките. „Дължина на думата“ задава най-късата и най-дългата дума (по подразбиране от 2 до 12 букви). „Започва с“, „Завършва с“ и „Съдържа“ приемат по една от твоите букви. „Използвай всички букви“ търси точни анаграми и фиксира дължината на броя на написаните букви.',
        'Натисни „Намери думи“. Резултатите са по дължина, най-дългите първи, или по азбучен ред, ако избереш това. Натисни етикет с дължина, за да видиш само думите с толкова букви, „Покажи още думи“ за следващите 72 и „Копирай“ за копиране на дума.',
        'Включи точките от Scrabble или Boggle, ако искаш да сравниш ходове. Точките се показват до всяка дума.',
      ],
    },
    {
      title: 'Три примера с истински резултат',
      paragraphs: ['Това са точните резултати на страницата за показаните настройки, от българския речник, описан по-долу.'],
      examples: [
        {
          title: 'Буквите слушам, стандартни настройки',
          text: ['Търсачката намира 24 думи от тези шест букви, като всяка буква се ползва най-много толкова пъти, колкото си я написал. По дължина: 7 думи от две букви, 9 от три, 5 от четири, 2 от пет и 1 от шест. Думите от пет и шест букви са слуша, смуша и слушам. Резултатът включва и редки думи като „муша“ и „аум“.'],
        },
        {
          title: 'Буквите триъгълник, „Използвай всички букви“',
          text: ['Търсят се само думи с точно тези десет букви. Остава една: триъгълник. Значи в речника няма друга анаграма на тази дума. Без филтъра думите са 70, по дължина: 6 от две букви, 18 от три, 24 от четири, 10 от пет, 8 от шест, 3 от седем и 1 от десет.'],
        },
        {
          title: 'Буквите триъгълник, най-къса дума 6 букви',
          text: ['Така остават 12 думи: триъгълник, клиринг, кърлинг, ъгълник, кръгъл, кънтри, лигнит, рингит, ритник, трилик, тринки и търлък. Някои са специални или редки, а речникът включва и заемки.'],
        },
      ],
    },
    {
      title: 'Откъде са думите и какви са границите',
      paragraphs: [
        'Търсачката ползва българския речник във файловете на сайта: около 126 500 думи, всяка с малки букви от а до я. Списъкът е с лиценз MIT и е получен от [проекта bayganyu/bulgarian-dictionary](https://github.com/bayganyu/bulgarian-dictionary); лицензът е във файл до списъка. Ползваме го такъв, какъвто е, и не твърдим, че е пълен или официален.',
        'В него има словоформи (членувани и множествено число), редки и специални думи, а понякога и собствени имена и заемки. Той не е речникът на никоя конкретна игра, затова резултат може да бъде отхвърлен от играта ти, а дума, която играта приема, може да липсва тук. Провери правилата и речника на играта, която играеш.',
        'Няма празна плочка или заместител: всяка буква в резултата е една от написаните. Ако знаеш шаблона на думата, ползвай [помощника за кръстословици](/letterwell/bg/krastoslovitsi/). Търсенето става в браузъра ти. Буквите не се изпращат към сървър, отчитат се само броят букви и броят резултати. Последните търсения остават в страницата и изчезват при презареждане.',
      ],
    },
    {
      title: 'Как се изчисляват точките',
      bullets: [
        'Scrabble: сумата от стойностите на буквите според таблица за българските букви, която е в кода на страницата. Бонус полетата не се броят, а изданията на играта може да се различават.',
        'Boggle: по дължина на думата. Думи от 3 или 4 букви носят 1 точка, от 5 букви 2, от 6 букви 3, от 7 букви 5, а от 8 или повече 11. По-късите носят 0.',
        'Пример: „триъгълник“ носи 18 точки в Scrabble и 11 в Boggle.',
      ],
      paragraphs: ['Точките от Words With Friends са налични само за английски думи.'],
    },
    {
      title: 'Стратегия: как да намериш повече думи (наш съвет)',
      paragraphs: [
        'Това е наш съвет, а не официален метод. Ползвай етикетите с дължини, за да търсиш първо най-дългите думи, после слизай надолу. Пробвай често срещани окончания (-КА, -НИЕ, -ОСТ) и представки (ПРЕ-, ПРО-, ИЗ-) с твоите букви. Ползвай „Започва с“ и „Завършва с“, за да проверяваш по една идея. Включи „Използвай всички букви“, за да видиш дали целият ти набор прави дума. Ако играеш за точки, сравни точките на две-три възможности, вместо винаги да вземаш най-дългата.',
      ],
    },
    {
      title: 'Въпроси',
      faq: [
        { q: 'Може ли празна плочка или заместител?', a: 'Не. Всяка буква в резултата е една от написаните. За дума с известни букви и празни места ползвай [помощника за кръстословици](/letterwell/bg/krastoslovitsi/).' },
        { q: 'Защо показва дума, която играта ми не приема?', a: 'Речникът ни е голям общ списък, а не списъкът на конкретна игра. Провери думата в речника на играта си.' },
        { q: 'Колко букви мога да въведа?', a: 'До 16. Най-късата дума е с 2 букви, а най-дългата задаваш ти, до 16.' },
        { q: 'Намира ли анаграми?', a: 'Да. Включи „Използвай всички букви“. За ежедневен пъзел с шест букви опитай [Анаграма на деня](/letterwell/bg/anagrama-na-denya/).' },
        { q: 'Работи ли на английски?', a: 'Да. Отвори [английската търсачка](/letterwell/) или смени езика от менюто. Тя ползва английски речник и английски стойности на буквите.' },
      ],
    },
    {
      title: 'Свързани инструменти и статии',
      links: [
        { href: '/bg/blog/kak-da-namerish-dumi-ot-bukvi/', label: 'Как да намериш повече думи от букви', note: 'статия' },
        { href: '/letterwell/bg/wordle/', label: 'Помощник за Wordle', note: 'стесни отговора' },
        { href: '/letterwell/bg/krastoslovitsi/', label: 'Помощник за кръстословици', note: 'думи по шаблон' },
        { href: '/letterwell/bg/spelling-bee/', label: 'Помощник за Spelling Bee', note: 'подсказки, думи и панграми' },
      ],
    },
  ],
}
