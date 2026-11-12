---
title: 'How compound interest works, with monthly deposits and real numbers'
description: 'The compound interest formula with monthly deposits, worked examples at 4% and 7%, why starting early beats saving more later, the rule of 72 and APY.'
date: 2026-11-12
lang: en
tags: [savings, interest, everyday-sums]
tool: compound-interest-calculator
---

**10,000 plus 200 a month at 7% a year grows to 144,572.72 in 20 years.** You put in 58,000; the other 86,572.72 is interest. With compound interest the interest is added to the balance and then earns interest itself, so growth speeds up the longer the money stays in.

The sums below work in any currency.

## The formula

**balance = P × (1 + r)<sup>n</sup> + PMT × ((1 + r)<sup>n</sup> − 1) ÷ r**

- **P** is what you start with.
- **PMT** is the monthly deposit, added at the end of each month.
- **r** is the monthly rate: the annual rate ÷ 12. At 7% that is 0.005833.
- **n** is the number of months. Twenty years is 240.

The first part grows the starting amount, the second adds up every deposit with the interest it earned. This is how the SEC's Investor.gov calculator works when interest is compounded monthly.

## Simple interest vs compound interest

10,000 at 7% for 20 years:

- **Simple interest** (the interest is paid out, not added): 10,000 + 20 × 700 = **24,000**.
- **Compound interest** (monthly): 10,000 × 1.005833<sup>240</sup> = **40,387.39**.

The difference, 16,387.39, is interest earned on interest.

## Monthly deposits: 200 a month

| Years | You put in | At 4% | At 7% |
| --- | --- | --- | --- |
| 10 | 24,000 | 29,449.96 | 34,616.96 |
| 20 | 48,000 | 73,354.93 | 104,185.33 |
| 30 | 72,000 | 138,809.88 | 243,994.20 |

At 7% over 30 years, the interest (171,994.20) is more than twice what you paid in. Over 10 years it is less than half. Time does most of the work.

## Starting early beats saving more later

Two savers, both at 7%:

- **Early:** 200 a month for 10 years, then nothing for 20 more years. Puts in 24,000 and ends with **139,808.87**.
- **Late:** waits 10 years, then 200 a month for 20 years. Puts in 48,000 and ends with **104,185.33**.

The early saver pays in half as much and ends with about a third more.

## The rule of 72

To estimate how long money takes to double, divide 72 by the rate in percent. At 7% that is about 10.3 years, at 4% about 18 years and at 9% about 8. It is a shortcut for a lump sum without deposits; at 7% the exact doubling time with monthly compounding is just under 10 years.

## APY and the rate on the offer

A savings account that compounds monthly earns a little more than its nominal rate over a year. 7% compounded monthly is an **annual percentage yield (APY) of about 7.23%**: (1 + 0.07 ÷ 12)<sup>12</sup> − 1. When you compare accounts, compare APY with APY.

## What the formula leaves out

- **Inflation.** A balance of 144,572.72 in 20 years buys less than the same amount today. Use a lower rate (the return minus inflation) for a rough real value.
- **Tax and fees.** Both reduce what compounds.
- **Changing returns.** Investments do not earn the same rate every year. The calculator is an estimate, not a forecast.

With the [compound interest calculator](/compound-interest-calculator/) you enter the starting amount, the monthly deposit, the rate and the years and see the balance year by year.

## Sources

Checked 12 November 2026.

- [SEC Investor.gov: compound interest calculator](https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator)
- [SEC Investor.gov glossary: the rule of 72](https://www.investor.gov/introduction-investing/investing-basics/glossary/rule-72)
- All the figures were run with the same function the calculator on this site uses.
