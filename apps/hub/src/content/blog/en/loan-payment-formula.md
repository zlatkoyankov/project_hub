---
title: 'Loan payment formula: how the monthly payment is calculated, with examples'
description: 'The amortization formula step by step, a 25,000 loan at 7% over 5 years, how much of each payment is interest, how the term changes the cost, and why APR matters.'
date: 2026-11-11
lang: en
tags: [loans, everyday-sums]
tool: loan-calculator
translation: bg/kak-se-smyata-vnoska-po-kredit
---

On a loan with equal monthly payments, **25,000 at 7% a year over 5 years costs 495.03 a month**. Over 60 payments you pay back 29,701.80, so the interest is 4,701.80. The number to compare offers by, though, is not the interest rate but the APR.

The sums below work in any currency.

## The formula

**payment = P × r ÷ (1 − (1 + r)<sup>−n</sup>)**

- **P** is the amount borrowed (the principal).
- **r** is the monthly rate: the annual rate divided by 12 and by 100. At 7% that is 0.07 ÷ 12 = 0.005833.
- **n** is the number of monthly payments. Five years is 60.

You will also see it written as P × r(1 + r)<sup>n</sup> ÷ ((1 + r)<sup>n</sup> − 1). It is the same formula, multiplied through by (1 + r)<sup>n</sup>.

For 25,000: 25,000 × 0.005833 ÷ (1 − 1.005833<sup>−60</sup>) = **495.03**.

## What is inside each payment

The payment stays the same, but what it pays for changes. Interest is charged on what you still owe, so early payments are mostly interest.

- **Month 1:** interest is 25,000 × 0.005833 = 145.83. The other 349.20 reduces the balance.
- **After 12 payments** you have paid 1,612.91 in interest and 4,327.45 off the balance. You still owe 20,672.55.

So about a third of all the interest on the loan is paid in the first year. That is why extra payments early on save the most.

## How the term changes the cost

The same 25,000 at 7%:

| Term | Monthly payment | Total interest |
| --- | --- | --- |
| 3 years | 771.93 | 2,789.39 |
| 5 years | 495.03 | 4,701.80 |
| 7 years | 377.32 | 6,694.63 |

A longer term makes the payment lighter, but the interest grows. Over 7 years you pay almost two and a half times the interest of a 3-year loan.

On a mortgage the effect is bigger. 300,000 at 6.5% costs 1,896.20 a month over 30 years and 2,613.32 over 15 years. The total interest is 382,633.47 over 30 years and 170,397.98 over 15.

## Interest rate and APR are not the same

The interest rate is the price of the money. The **annual percentage rate (APR)** also includes the lender's fees, such as origination charges, which is why the APR is usually higher. Two offers with the same rate can have very different APRs. Compare APR with APR, and look at the total you will pay back.

The formula above uses the interest rate, so the calculator shows principal and interest only. On a mortgage, property tax, insurance and escrow come on top of that.

## Common mistakes

- **Working out the interest as simple interest.** 25,000 × 7% × 5 years = 8,750. The real interest is 4,701.80, because the balance goes down every month.
- **Comparing only the payments.** A lower payment is often just a longer term.
- **Looking at the rate instead of the APR.** Fees can make the lower rate the more expensive loan.
- **Using the annual rate as r.** r is monthly: divide by 12 first.

With the [loan payment calculator](/loan-calculator/) you type the amount, the rate and the term and see the payment, the total and the interest.

## Sources

Checked 11 November 2026.

- [Math Central (University of Regina): the amortization payment formula](https://mathcentral.uregina.ca/QandQ/topics/amortization)
- [CFPB: the difference between a loan's interest rate and its APR](https://www.consumerfinance.gov/ask-cfpb/what-is-an-apr-en-733/)
- [CFPB: mortgage interest rate vs APR, and what the APR includes](https://www.consumerfinance.gov/ask-cfpb/what-is-the-difference-between-a-mortgage-interest-rate-and-an-apr-en-135/)
- [AJ Design: worked example, 25,000 at 7% for 5 years ≈ 495.03 a month](https://ajdesigner.com/loan/)
- The tables were run with the same function the loan calculator on this site uses.
