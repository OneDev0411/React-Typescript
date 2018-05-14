import { getSmallPrice } from './listing'

// Homes in the millions:
test('round 1865000 to 1.87m', () => {
  expect(getSmallPrice(1865000)).toBe('1.87m')
})
test('round 1298000 to 1.87m', () => {
  expect(getSmallPrice(1298000)).toBe('1.30m')
})
test('round 1995000 to 1.87m', () => {
  expect(getSmallPrice(1995000)).toBe('2.00m')
})

// Homes in the millions:
test('round 895000 to 895k', () => {
  expect(getSmallPrice(895000)).toBe('895k')
})
test('round 895300 to 895k', () => {
  expect(getSmallPrice(895300)).toBe('895k')
})
test('round 895900 to 896k', () => {
  expect(getSmallPrice(895900)).toBe('896k')
})
test('round 899500 to 900k', () => {
  expect(getSmallPrice(899500)).toBe('900k')
})
test('round 999500 to 1.00m', () => {
  expect(getSmallPrice(999500)).toBe('1.00m')
})

// Homes in the thousands:
test('round 2850 to 2.85k', () => {
  expect(getSmallPrice(2850)).toBe('2.85k')
})
test('round 2853 to 2.85k', () => {
  expect(getSmallPrice(2853)).toBe('2.85k')
})
test('round 2855 to 2.86k', () => {
  expect(getSmallPrice(2855)).toBe('2.86k')
})
test('round 2898 to 2.90k', () => {
  expect(getSmallPrice(2898)).toBe('2.90k')
})
test('round 2999 to 3.00k', () => {
  expect(getSmallPrice(2999)).toBe('3.00k')
})
