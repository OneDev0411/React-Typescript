import {
  getWeekdayName,
  getMonthName,
  getDayNumber,
  getSecondsSinceStartOfDay,
} from './date-utils'

describe('utils/date-utils', () => {
  it('getWeekdayName', () => {
    const thursday = new Date('2021-04-15T16:00:00.633Z')
    const wednesday = new Date('2021-04-14T16:00:00.633Z')
    expect(getWeekdayName(thursday)).toBe<Weekday>('Thursday')
    expect(getWeekdayName(wednesday)).toBe<Weekday>('Wednesday')
  })

  it('getMonthName', () => {
    const aDayInMarch = new Date('2010-03-14T16:00:00.633Z')

    expect(getMonthName(aDayInMarch)).toBe('Mar')
  })

  it('getDayNumber', () => {
    const fourthOfJuly = new Date('2010-07-04T16:00:00.633Z')

    expect(getDayNumber(fourthOfJuly)).toBe('4')
  })

  it('getSecondsSinceStartOfDay', () => {
    const someDayTenAm = new Date()
    someDayTenAm.setHours(10, 0, 0, 100)

    expect(getSecondsSinceStartOfDay(someDayTenAm)).toBe(10 * 3600)
  })
})
