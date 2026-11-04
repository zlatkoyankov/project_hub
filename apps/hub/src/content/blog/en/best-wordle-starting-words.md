---
title: 'The best Wordle starting words, tested on 2,315 answers'
description: 'We scored about 4,000 five-letter words as Wordle openers. RAISE, SLATE and CRANE come out on top; AUDIO and ADIEU do surprisingly badly. Here is why.'
date: 2026-11-04
lang: en
tags: [words, word-games, wordle]
tool: wordle-solver
---

Everyone has a favourite first word in Wordle. Some people swear by AUDIO because it clears four vowels at once, and others use the same lucky word every morning. Rather than trust habit, we tested every candidate: about 4,000 everyday five-letter words, each tried as the opening guess against 2,315 possible answers.

The short version: **RAISE, ARISE, IRATE, AROSE and LATER** leave the fewest answers after one guess, and **SLATE and CRANE** win slightly over whole games. The vowel-heavy favourites, AUDIO and ADIEU, are among the weakest common choices.

## How we tested

Wordle gives you six guesses to find a five-letter word. After each guess, every letter turns green (right letter, right place), yellow (in the word, wrong place) or grey (not in the word). A good opener is one whose colours split the possible answers into as many small groups as possible, so that whatever you see, few words are left.

For the test we needed a realistic pool of answers. The official answer list is not public in a form we can reuse, so we built our own:

- We took the five-letter words from Letterwell's English dictionary.
- We kept the ones that appear in a large frequency list built from film and TV subtitles, which removes obscure words most people would never guess.
- We removed plurals such as RATES and TALES, because Wordle rarely uses them as answers.
- That left 2,315 everyday words, the same size as the original Wordle answer list.

For each possible opener we calculated how many answers would remain **on average** after seeing its colours. Then, for the most popular openers, we played all 2,315 games to the end with the same follow-up strategy the [Wordle helper](/letterwell/wordle-solver/) uses.

## The results after one guess

| Opening word | Answers left on average | Rank of ~4,000 |
| --- | --- | --- |
| RAISE | 62.7 | 1 |
| ARISE | 67.4 | 3 |
| IRATE | 67.7 | 4 |
| AROSE | 67.9 | 5 |
| LATER | 69.6 | 7 |
| STARE | 74.9 | 14 |
| CRATE | 76.0 | 15 |
| TRACE | 76.4 | 16 |
| CRANE | 78.0 | 23 |
| SLATE | 78.9 | 27 |
| ADIEU | 122.3 | 590 |
| HOUSE | 132.3 | 779 |
| AUDIO | 175.6 | 1,652 |

Starting with RAISE cuts 2,315 possible answers to about 63 on average. AUDIO leaves almost three times as many.

## Why AUDIO and ADIEU disappoint

Vowel-heavy openers feel efficient, but they spend letters on information you get anyway. Almost every five-letter word contains A, E or O. Finding out that the answer has an A and an O tells you less than you might think.

Consonants are where answers differ. R, S, T, L and N appear in a large share of everyday words, and they sit in many different positions. A word like RAISE checks two of the most common vowels (A and E), one more vowel (I) and two of the most useful consonants (R and S). Each letter does real work.

There is also a position effect. Green tiles are worth much more than yellow ones, and an opener whose letters often land in their usual spots (S at the start, E at the end, R in second place) produces more greens.

## Over a whole game the differences shrink

We then played every one of the 2,315 games to the finish with five openers, always choosing the next guess that leaves the fewest answers on average:

| Opener | Average guesses | Solved in 4 or fewer |
| --- | --- | --- |
| SLATE | 3.48 | 95.9% |
| CRANE | 3.49 | 96.1% |
| RAISE | 3.53 | 94.7% |
| ADIEU | 3.69 | 92.5% |
| AUDIO | 3.71 | 89.8% |

Every game was solved within six guesses whatever the opener. The best openers save you about a fifth of a guess per game compared with AUDIO. That sounds small, but over a year it is the difference between a lot of fours and a lot of threes.

Interestingly, RAISE leads after one guess, but SLATE and CRANE edge it over complete games. Their letters combine better with the second guesses that follow. Any word from the top of the table is an excellent choice; the gap between them is a few hundredths of a guess.

## Practical advice

- **Pick one strong opener and keep it.** RAISE, SLATE, CRANE, CRATE and TRACE are all excellent. Using the same word every day also makes it easier to recognise patterns in the colours.
- **Avoid all-vowel openers.** AUDIO and ADIEU are fun, but they cost you on average.
- **Do not repeat a letter in your first guess.** A double letter tests one letter instead of two.
- **Think about your second guess, not only the first.** How you follow up matters as much as the opener. Our article on [solving Wordle in fewer guesses](/blog/how-to-solve-wordle-in-fewer-guesses/) covers that.

## Try it on today's puzzle

If you are stuck partway through, type your guesses into the [Wordle helper](/letterwell/wordle-solver/), tap the tiles to match your colours, and it lists every word that still fits, with the best next guess. It runs in your browser and works for Bulgarian Wordle too.

*A note on the numbers: our answer pool is an approximation of the real one, built from common English words. Exact figures would shift slightly with the official list, but the ranking of strong and weak openers is robust.*
