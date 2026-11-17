import type { PageContent } from './types'

export const dailyContent: PageContent = {
  en: [
    {
      title: 'How the colours work, with a repeated letter',
      paragraphs: [
        'The rules above are the whole game, but one detail trips people up: letters that appear twice. A letter is coloured as many times as it occurs in the hidden word, and no more. Green (coral here) is given first, then the “elsewhere” marks go to the remaining copies from left to right.',
      ],
      examples: [
        {
          title: 'Guess ABBEY when the word is BIBLE',
          text: ['These are real results from the game’s own colouring code for an invented game, not for today’s word. A is grey, because BIBLE has no A. The first B is blue (in the word, but elsewhere), the second B is coral (right place), E is blue and Y is grey. BIBLE has two Bs, so both Bs in ABBEY get a mark. If a guess had a third B, it would be grey.'],
        },
      ],
    },
    {
      title: 'Where the words come from, and the limits',
      paragraphs: [
        'Daily answers are everyday nouns and adjectives from our five-letter word list, shuffled once into a fixed order. There are 359 English answers. When the list runs out it starts again, and new words are only added at the end, so the order of the days does not change. Your guesses can be any five-letter word in our dictionary, a list of about 12,600 words that includes many you would not use as a guess.',
        'The dictionary is an MIT-licensed list (its licence file credits Sindre Sorhus), and the roughly 4,000 everyday words are ordered with frequency data from FrequencyWords by Hermit Dave (CC BY-SA 4.0). We do not claim the lists are complete or official. The game is our own, with its own name and look, and is not affiliated with The New York Times.',
        'The day changes at midnight Sofia time, so for players in the UK or the Americas a new word arrives in the afternoon or evening. Streaks and statistics are kept in your browser, without sign-up. If you clear your browser data they go too.',
      ],
    },
    {
      title: 'Strategy (our advice)',
      paragraphs: [
        'This is our advice, not an official method. Use a first guess with common letters, such as the ones listed in the [Wordle helper](/letterwell/wordle-solver/) or tested in [Best Wordle starting words](/blog/best-wordle-starting-words/). On the second guess, avoid reusing grey letters; use new letters so that you learn something every time. Keep the coral letters where they are and try the blue ones in new places. When two or three possible words are left, guess one of them instead of testing letters. The hints behind the light bulb above the board are there if you want a nudge before the last tries, and you can read them one at a time on the [hints page](/letterwell/daily/hints/).',
      ],
    },
    {
      title: 'More questions',
      faq: [
        { q: 'When does the word change?', a: 'At midnight in Sofia (Europe/Sofia time). The same word is shown to everyone on the same date.' },
        { q: 'What does Unlimited mode do?', a: 'It gives you a random word from the same list each time. The statistics and the streak count the daily words only.' },
        { q: 'How do I share without spoiling?', a: 'The share text has only coloured squares and the number of tries, never the letters.' },
        { q: 'Why was my word refused?', a: 'It must have five letters and be in our dictionary. Rare words are included, but not every word exists in our dictionary.' },
        { q: 'Is there a Bulgarian version?', a: 'Yes: [Дума на деня](/letterwell/bg/duma-na-denya/), with Bulgarian words.' },
      ],
    },
    {
      title: 'Related tools and articles',
      links: [
        { href: '/letterwell/daily/hints/', label: 'Letterwell Daily hints', note: 'clues without the answer' },
        { href: '/blog/how-to-solve-wordle-in-fewer-guesses/', label: 'How to solve Wordle in fewer guesses', note: 'article' },
        { href: '/letterwell/anagram/', label: 'Letterwell Anagram', note: 'a daily six-letter puzzle' },
        { href: '/letterwell/wordle-solver/', label: 'Wordle helper', note: 'narrow down the answer' },
      ],
    },
  ],
  bg: [
    {
      title: 'Как работят цветовете при повтаряща се буква',
      paragraphs: [
        'Правилата по-горе са цялата игра, но едно нещо обърква хората: буквите, които се срещат два пъти. Буква се оцветява толкова пъти, колкото се среща в скритата дума, и не повече. Първо се дава коралово (точно място), после знаците „на друго място“ отиват на останалите копия отляво надясно.',
      ],
      examples: [
        {
          title: 'Опит КУБИК, когато думата е БУТИК',
          text: ['Това са истински резултати от оцветяването на самата игра за измислена игра, а не за днешната дума. Първото К е сиво, защото последното К в БУТИК е на точното място и вече е „използвало“ единственото К. У е коралово, Б е синьо (има го, но на друго място), И е коралово и последното К е коралово. БУТИК има едно К, затова само едно от двете К в КУБИК получава цвят.'],
        },
      ],
    },
    {
      title: 'Откъде са думите и какви са границите',
      paragraphs: [
        'Отговорите са познати съществителни и прилагателни от нашия списък с думи от пет букви, подредени веднъж в постоянен ред. Има 559 български отговора. Когато списъкът свърши, започва отначало, а нови думи се добавят само в края, така че редът на дните не се променя. Опитите ти може да са всяка дума от пет букви в речника ни, списък от около 6300 думи, в който има и много думи, които не бихте използвали като опит.',
        'Речникът е с лиценз MIT и е получен от [проекта bayganyu/bulgarian-dictionary](https://github.com/bayganyu/bulgarian-dictionary), а около 2100 често срещани думи са подредени по честотни данни от FrequencyWords на Hermit Dave (CC BY-SA 4.0). Не твърдим, че списъците са пълни или официални. Играта е наша, със собствено име и вид, и не е свързана с The New York Times.',
        'Денят се сменя в полунощ българско време. Серията и статистиката се пазят в браузъра ти, без регистрация. Ако изчистиш данните на браузъра, изчезват и те.',
      ],
    },
    {
      title: 'Стратегия (наш съвет)',
      paragraphs: [
        'Това е наш съвет, а не официален метод. Започни с дума с често срещани букви, като тези в [помощника за Wordle](/letterwell/bg/wordle/) или тествани в статията [Как да решаваш Wordle на български](/bg/blog/kak-da-reshavash-wordle-na-balgarski/). При втория опит не повтаряй сиви букви: ползвай нови, за да научаваш нещо всеки път. Дръж коралово оцветените букви там, където са, и пробвай синьо оцветените на нови места. Когато остават две-три възможни думи, налучквай някоя от тях, вместо да проверяваш букви. Подсказките зад крушката над дъската са за тласък преди последните опити, а можеш да ги четеш една по една и на [страницата с подсказки](/letterwell/bg/duma-na-denya/podskazki/).',
      ],
    },
    {
      title: 'Още въпроси',
      faq: [
        { q: 'Кога се сменя думата?', a: 'В полунощ българско време. Същата дума се показва на всички за една и съща дата.' },
        { q: 'Какво прави режимът „Неограничено“?', a: 'Дава ти случайна дума от същия списък всеки път. Статистиката и серията се отнасят само за дневните думи.' },
        { q: 'Как да споделя, без да издам думата?', a: 'Текстът за споделяне съдържа само цветни квадратчета и броя опити, никога буквите.' },
        { q: 'Защо думата ми беше отхвърлена?', a: 'Трябва да е с пет букви и да е в речника ни. Редките думи са включени, но не всяка дума има в речника ни.' },
        { q: 'Има ли английска версия?', a: 'Да: [Letterwell Daily](/letterwell/daily/), с английски думи.' },
      ],
    },
    {
      title: 'Свързани инструменти и статии',
      links: [
        { href: '/letterwell/bg/duma-na-denya/podskazki/', label: 'Подсказки за „Дума на деня“', note: 'без спойлери' },
        { href: '/bg/blog/kak-da-reshavash-wordle-na-balgarski/', label: 'Как да решаваш Wordle на български', note: 'статия' },
        { href: '/letterwell/bg/anagrama-na-denya/', label: 'Анаграма на деня', note: 'ежедневен пъзел с шест букви' },
        { href: '/letterwell/bg/wordle/', label: 'Помощник за Wordle', note: 'стесни отговора' },
      ],
    },
  ],
}
