import { humanizeSeconds, formatTimeDigits, timeToSeconds } from './helpers'

describe('Flow edit helpers', () => {
  it('humanizeSeconds', () => {
    expect(humanizeSeconds(86400)).toEqual({
      days: 1,
      hours: 0,
      minutes: 0,
      seconds: 0
    })
    expect(humanizeSeconds(86401)).toEqual({
      days: 1,
      hours: 0,
      minutes: 0,
      seconds: 1
    })
    expect(humanizeSeconds(86399)).toEqual({
      days: 0,
      hours: 23,
      minutes: 59,
      seconds: 59
    })
    expect(humanizeSeconds(172801)).toEqual({
      days: 2,
      hours: 0,
      minutes: 0,
      seconds: 1
    })
    expect(humanizeSeconds(3661)).toEqual({
      days: 0,
      hours: 1,
      minutes: 1,
      seconds: 1
    })
  })

  it('formatTimeDigits', () => {
    expect(formatTimeDigits(0)).toEqual('00')
    expect(formatTimeDigits(1)).toEqual('01')
    expect(formatTimeDigits(9)).toEqual('09')
    expect(formatTimeDigits(10)).toEqual('10')
    expect(formatTimeDigits(1000)).toEqual('1000')
  })

  it('timeToSeconds', () => {
    expect(timeToSeconds('00:00')).toEqual(0)
    expect(timeToSeconds('8:10')).toEqual(29400)
    expect(timeToSeconds('23:0')).toEqual(82800)
  })
})
