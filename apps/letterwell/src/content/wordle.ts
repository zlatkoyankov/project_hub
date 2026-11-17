import type { PageContent } from './types'

export const wordleContent: PageContent = {
  en: [
    {
      title: 'How to use the Wordle helper',
      steps: [
        'Type the word you guessed in your game and press “Add guess”. It must have five letters.',
        'Tap each tile to match what your game showed. A tile cycles from grey (the letter is not in the word) to yellow (it is in the word, in another place) to green (right letter, right place).',
        'Read the list of possible answers. Everyday words come first under “Likely answers”; less common words are hidden below until you ask for them. The number beside the heading is how many words still fit.',
        '“Try next” suggests a word that should shrink the list the most. Press “Use this guess” to add it as your next row, then play it in your game and colour the tiles the same way.',
        'Keep going, up to six guesses. If a row is wrong, remove it with the remove button, or start again.',
      ],
    },
    {
      title: 'Two worked examples',
      paragraphs: ['The numbers below are the real output of this page. The hidden words in the examples are only made-up games, not today’s puzzle.'],
      examples: [
        {
          title: 'Hidden word FUDGE, first guess RAISE',
          text: [
            'RAISE gives one green tile, the last E, and four grey tiles. Colour it that way and the helper lists 76 likely answers and 214 less common ones. It suggests COULD, which it says leaves about 2.8 possible answers on average.',
            'Playing COULD against FUDGE gives grey, grey, yellow, grey, yellow (the U and the D are in the word, but elsewhere). Now only 5 likely answers remain: judge, fudge, budge, nudge and undue. Five words is a short list you can pick from.',
          ],
        },
        {
          title: 'Repeated letters: guess GEESE, hidden word THERE',
          text: ['GEESE has three Es and THERE has two. The two Es in the right places are green and the extra E, in the second place, is grey. Enter exactly those colours and the helper treats the grey E as “there is no third E”, not as “there is no E”. A letter is only coloured yellow or green as many times as the hidden word contains it.'],
        },
      ],
    },
    {
      title: 'Where the word list comes from, and the limits',
      paragraphs: [
        'The helper uses the five-letter words of Letterwell’s English dictionary: about 12,600 words. The dictionary is an MIT-licensed list (its licence file credits Sindre Sorhus). The roughly 4,000 words that also appear in a frequency list built from film and TV subtitles are marked “likely” and ordered by frequency; the frequency data comes from FrequencyWords by Hermit Dave (CC BY-SA 4.0). The remaining words are in the “less common” group, in alphabetical order. A handful of slurs are left out.',
        'This is not the official Wordle answer list, and we do not claim it matches any game exactly. If your game accepts a word we do not have, the helper says the word is not in our list but still uses it as a clue.',
        'Everything runs in your browser. The words you enter are not sent to a server; we count only which guess number was reached.',
      ],
    },
    {
      title: 'How the suggestion is chosen',
      paragraphs: [
        'For every candidate guess, the helper works out what colours it would produce against each word that is still possible, and groups the possible answers by that result. The suggested word is the one whose groups are smallest on average (it minimises the sum of the squared group sizes). If two words score the same, one that could itself be the answer wins. When several hundred answers remain, the helper checks only the most frequent part of the list, to stay fast. It is a good heuristic, not a proof of the best possible play.',
      ],
    },
    {
      title: 'Strategy (our advice)',
      paragraphs: [
        'This is our own advice, not an official rule. Open with the same strong word every time: the helper lists RAISE, ARISE, IRATE, AROSE and LATER, which are among the words that left the fewest answers after one guess in our test. If the second guess still leaves dozens of words, use a word that tests new letters, even if it cannot be the answer. When only a handful of words remain, guess one of them.',
      ],
    },
    {
      title: 'Questions',
      faq: [
        { q: 'Does the helper know today’s answer?', a: 'No. It knows nothing about any particular game. It only filters its word list by the colours you enter.' },
        { q: 'Why does it list words my game would never use?', a: 'Because the list is general. Games often use a smaller answer list. The “likely” group is a good place to start.' },
        { q: 'What do I do if my guess is “not in our list”?', a: 'You can still add it. The helper uses its colours as a clue even when it does not have the word.' },
        { q: 'How are repeated letters handled?', a: 'As the game handles them: green tiles first, then yellow ones, but never more of a letter than the hidden word contains. See the GEESE example above.' },
        { q: 'Which first word should I use?', a: 'See the “Good first guesses” buttons on the page, and our test in [Best Wordle starting words](/blog/best-wordle-starting-words/).' },
      ],
    },
    {
      title: 'Related tools and articles',
      links: [
        { href: '/blog/best-wordle-starting-words/', label: 'The best Wordle starting words, tested', note: 'article' },
        { href: '/blog/how-to-solve-wordle-in-fewer-guesses/', label: 'How to solve Wordle in fewer guesses', note: 'article' },
        { href: '/letterwell/daily/', label: 'Letterwell Daily', note: 'our own five-letter game' },
        { href: '/letterwell/daily/hints/', label: 'Letterwell Daily hints', note: 'clues without the answer' },
      ],
    },
  ],
  bg: [
    {
      title: 'Как да ползваш помощника за Wordle',
      steps: [
        'Напиши думата, която си опитал в играта, и натисни „Добави опит“. Трябва да е с пет букви.',
        'Натисни всяка плочка, за да съвпадне с това, което е показала играта. Плочката сменя цвета си от сиво (буквата я няма в думата) към жълто (има я, но на друго място) и зелено (вярна буква на вярното място).',
        'Прочети списъка с възможни думи. Първо са често срещаните думи под „Най-вероятни“, а по-редките са скрити отдолу, докато не ги поискаш. Числото до заглавието е колко думи още пасват.',
        '„Пробвай“ предлага дума, която би трябвало да съкрати списъка най-много. Натисни „Използвай тази дума“, за да я добавиш като следващ ред, изиграй я в играта и оцвети плочките по същия начин.',
        'Продължавай до шест опита. Ако някой ред е грешен, премахни го с бутона за премахване или започни отначало.',
      ],
    },
    {
      title: 'Три примера с истински резултат',
      paragraphs: ['Числата по-долу са точният резултат на страницата. Скритите думи в примерите са измислени игри, а не днешният пъзел.'],
      examples: [
        {
          title: 'Скрита дума ПИСЪК, първи опит РОЛКА',
          text: [
            'РОЛКА дава една жълта плочка (К) и четири сиви. Оцвети я така и помощникът показва 40 най-вероятни думи и 85 по-редки. Предлага ТЕНИС, като казва, че оставя средно около 1,8 възможни думи.',
            'ТЕНИС срещу ПИСЪК дава сиво, сиво, сиво, жълто, жълто (И и С са в думата, но на други места). Остават 2 вероятни думи: писък и скуби. Втората показва, че речникът включва и собствени имена.',
          ],
        },
        {
          title: 'Скрита дума МАЛКО, първи опит РОЛКА',
          text: ['Този път Р е сиво, О жълто, Л и К зелени, А жълто. Помощникът показва само 2 думи: малко и жалко. Следващият опит е лесен: пробвай ги.'],
        },
        {
          title: 'Повтарящи се букви: опит ТЕТКА, скрита дума ЛАСТИ',
          text: ['В ТЕТКА буквата Т е два пъти, а в ЛАСТИ само един. Първото Т е жълто, а второто е сиво, защото втора Т в думата няма. Въведи точно тези цветове и помощникът ще разбере сивото Т като „няма втора Т“, а не като „няма Т“. Буква се оцветява в жълто или зелено най-много толкова пъти, колкото се среща в скритата дума.'],
        },
      ],
    },
    {
      title: 'Откъде е списъкът с думи и какви са границите',
      paragraphs: [
        'Помощникът ползва думите от пет букви от българския речник на Letterwell: около 6300 думи. Речникът е с лиценз MIT и е получен от [проекта bayganyu/bulgarian-dictionary](https://github.com/bayganyu/bulgarian-dictionary). Около 2100 думи, които се срещат и в честотен списък, съставен от субтитри на филми и сериали, са отбелязани като „най-вероятни“ и подредени по честота; честотните данни идват от FrequencyWords на Hermit Dave (CC BY-SA 4.0). Останалите са в групата „по-редки“, по азбучен ред. Няколко обидни думи са изключени.',
        'Това не е официалният списък на нито една игра и не твърдим, че съвпада точно с някоя. В него има и имена и заемки. Ако играта ти приеме дума, която я няма при нас, помощникът казва, че я няма в списъка, но пак я ползва като подсказка.',
        'Всичко работи в браузъра ти. Думите, които въвеждаш, не се изпращат към сървър, отчита се само кой по ред опит е стигнат.',
      ],
    },
    {
      title: 'Как се избира предложената дума',
      paragraphs: [
        'За всяка възможна дума помощникът изчислява какви цветове би дала срещу всяка още възможна дума и групира възможностите по този резултат. Предлага се думата с най-малки групи средно (минимална сума от квадратите на размерите на групите). При равенство печели дума, която може да е самият отговор. Когато остават стотици думи, помощникът проверява само най-често срещаната част от списъка, за да не се бави. Това е добра евристика, а не доказателство за най-добрата възможна игра.',
      ],
    },
    {
      title: 'Стратегия (наш съвет)',
      paragraphs: [
        'Това е наш съвет, а не официално правило. Започвай винаги със същата силна дума: помощникът предлага РОЛКА, НОРМА, КОРАЛ, КАТЕР и НОТКА, които са сред думите, оставящи най-малко възможности след първия опит в наш тест. Ако след втория опит още остават десетки думи, ползвай дума, която проверява нови букви, дори да не може да е отговор. Когато остават няколко думи, налучквай някоя от тях.',
      ],
    },
    {
      title: 'Въпроси',
      faq: [
        { q: 'Знае ли помощникът днешната дума?', a: 'Не. Той не знае нищо за конкретна игра. Само филтрира списъка си по цветовете, които въведеш.' },
        { q: 'Защо показва думи, които играта никога не би ползвала?', a: 'Защото списъкът е общ. Игрите често имат по-малък списък с отговори. Групата „най-вероятни“ е добро място да започнеш.' },
        { q: 'Какво да правя, ако опитът ми е „извън списъка“?', a: 'Пак можеш да го добавиш. Помощникът ползва цветовете му като подсказка, дори когато думата я няма.' },
        { q: 'Как се броят повтарящите се букви?', a: 'Както в играта: първо зелените плочки, после жълтите, но никога повече от броя на буквата в скритата дума. Виж примера с ТЕТКА по-горе.' },
        { q: 'С коя дума да започна?', a: 'Виж бутоните „Добри първи думи“ на страницата и теста ни в статията [Как да решаваш Wordle на български](/bg/blog/kak-da-reshavash-wordle-na-balgarski/).' },
      ],
    },
    {
      title: 'Свързани инструменти и статии',
      links: [
        { href: '/bg/blog/kak-da-reshavash-wordle-na-balgarski/', label: 'Как да решаваш Wordle на български', note: 'статия' },
        { href: '/letterwell/bg/duma-na-denya/', label: 'Дума на деня', note: 'наша игра с думи от пет букви' },
        { href: '/letterwell/bg/duma-na-denya/podskazki/', label: 'Подсказки за „Дума на деня“', note: 'без спойлери' },
        { href: '/letterwell/bg/krastoslovitsi/', label: 'Помощник за кръстословици', note: 'думи по шаблон' },
      ],
    },
  ],
}
