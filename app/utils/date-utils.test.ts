import {
  getWeekdayName,
  getMonthName,
  getDayNumber,
  getDaysBetween,
  datesAreOnSameDay,
  isToday,
  getSecondsSinceStartOfDay,
  hasDistance
} from './date-utils'

describe('utils/date-utils', () => {
  it('getWeekdayName', () => {
    const thursday = new Date('2021-04-15T16:00:00.633Z')
    const wednesday = new Date('2021-04-14T16:00:00.633Z')
    expect(getWeekdayName(thursday)).toBe<Weekday>('Thursday')
    expect(getWeekdayName(wednesday)).toBe<Weekday>('Wednesday')
  })

  it('isToday', () => {
    const now = new Date()
    expect(isToday(now)).toBeTruthy()

    const someOtherDayInThePast = new Date('2010-04-14T16:00:00.633Z')
    expect(isToday(someOtherDayInThePast)).toBeFalsy()

    const someOtherDayInTheFuture = new Date('2100-04-14T16:00:00.633Z')
    expect(isToday(someOtherDayInTheFuture)).toBeFalsy()
  })

  it('getMonthName', () => {
    const aDayInMarch = new Date('2010-03-14T16:00:00.633Z')

    expect(getMonthName(aDayInMarch)).toBe('Mar')
  })

  it('getDayNumber', () => {
    const fourthOfJuly = new Date('2010-07-04T16:00:00.633Z')

    expect(getDayNumber(fourthOfJuly)).toBe('4')
  })

  it('getDaysBetween', () => {
    const firstDayOfJuly = new Date('2010-07-01T16:00:00.633Z')
    const seventhDayOfJuly = new Date('2010-07-07T16:00:00.633Z')

    const firstWeekOfJuly = getDaysBetween(firstDayOfJuly, seventhDayOfJuly)
    expect(firstWeekOfJuly).toHaveLength(7)
  })

  it('datesAreOnSameDay', () => {
    const fourthOfJuly = new Date('2010-07-04T16:00:00.633Z')
    const fifthOfJuly = new Date('2010-07-05T16:00:00.633Z')
    const anotherFourthOfJuly = new Date('2010-07-04T12:30:00.633Z')

    expect(datesAreOnSameDay(fourthOfJuly, anotherFourthOfJuly)).toBeTruthy()
    expect(datesAreOnSameDay(fourthOfJuly, fifthOfJuly)).toBeFalsy()
  })

  it('getSecondsSinceStartOfDay', () => {
    const someDayTenAm = new Date()
    someDayTenAm.setHours(10, 0, 0, 100)

    expect(getSecondsSinceStartOfDay(someDayTenAm)).toBe(10 * 3600)
  })

  it('hasDistance', () => {
    const sixAm = new Date()
    sixAm.setHours(6, 0, 0, 0)

    const elevenAm = new Date()
    elevenAm.setHours(11, 0, 0, 0)

    expect(hasDistance(elevenAm, sixAm, 4 * 3600)).toBeTruthy()
    expect(hasDistance(elevenAm, sixAm, 5 * 3600)).toBeFalsy()
  })
})
