import { describe, expect, it } from 'vitest'
import { amountToWords, numberToWords, splitAmount } from './words-bg'

describe('numberToWords', () => {
  it.each([
    [0, 'нула'],
    [1, 'едно'],
    [2, 'две'],
    [11, 'единадесет'],
    [20, 'двадесет'],
    [21, 'двадесет и едно'],
    [35, 'тридесет и пет'],
    [100, 'сто'],
    [105, 'сто и пет'],
    [150, 'сто и петдесет'],
    [215, 'двеста и петнадесет'],
    [999, 'деветстотин деветдесет и девет'],
    [1000, 'хиляда'],
    [1005, 'хиляда и пет'],
    [1200, 'хиляда и двеста'],
    [1234, 'хиляда двеста тридесет и четири'],
    [2000, 'две хиляди'],
    [2100, 'две хиляди и сто'],
    [21000, 'двадесет и една хиляди'],
    [65000, 'шестдесет и пет хиляди'],
    [100000, 'сто хиляди'],
    [1000000, 'един милион'],
    [1001000, 'един милион и хиляда'],
    [1300000, 'един милион и триста хиляди'],
    [2000300, 'два милиона и триста'],
    [1200065785, 'един милиард двеста милиона шестдесет и пет хиляди седемстотин осемдесет и пет'],
  ])('%i (neuter) → %s', (value, words) => {
    expect(numberToWords(value, 'n')).toBe(words)
  })

  it('agrees with the gender of the noun', () => {
    expect(numberToWords(1, 'm')).toBe('един')
    expect(numberToWords(2, 'm')).toBe('два')
    expect(numberToWords(1, 'f')).toBe('една')
    expect(numberToWords(22, 'f')).toBe('двадесет и две')
    expect(numberToWords(2000000, 'n')).toBe('два милиона')
  })

  it('rejects what it cannot write', () => {
    expect(() => numberToWords(1.5)).toThrow(RangeError)
    expect(() => numberToWords(-1)).toThrow(RangeError)
    expect(() => numberToWords(1e12)).toThrow(RangeError)
  })
})

describe('amountToWords', () => {
  it('writes euro and cents', () => {
    expect(amountToWords(1234.56)).toBe('Хиляда двеста тридесет и четири евро и петдесет и шест цента')
    expect(amountToWords(1)).toBe('Едно евро')
    expect(amountToWords(2.01)).toBe('Две евро и един цент')
    expect(amountToWords(21.21)).toBe('Двадесет и едно евро и двадесет и един цента')
    expect(amountToWords(0)).toBe('Нула евро')
  })

  it('has the invoice variants', () => {
    expect(amountToWords(1234.56, { cents: 'digits' })).toBe('Хиляда двеста тридесет и четири евро и 56 цента')
    expect(amountToWords(1234.05, { cents: 'digits' })).toBe('Хиляда двеста тридесет и четири евро и 05 цента')
    expect(amountToWords(120, { cents: 'digits', zeroCents: true })).toBe('Сто и двадесет евро и 00 цента')
    expect(amountToWords(3.5, { euroCent: true })).toBe('Три евро и петдесет евроцента')
  })

  it('writes leva and stotinki for older documents', () => {
    expect(amountToWords(1, { currency: 'bgn' })).toBe('Един лев')
    expect(amountToWords(2.02, { currency: 'bgn' })).toBe('Два лева и две стотинки')
    expect(amountToWords(21.01, { currency: 'bgn' })).toBe('Двадесет и един лева и една стотинка')
  })

  it('rounds to the cent', () => {
    expect(splitAmount(0.105 + 0.2)).toEqual({ whole: 0, cents: 31 })
    expect(splitAmount(19.999)).toEqual({ whole: 20, cents: 0 })
    expect(amountToWords(0.07)).toBe('Нула евро и седем цента')
  })
})
