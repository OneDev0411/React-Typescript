import {
  fixLeadingZero,
  msToMinutesAndSeconds,
  getMarkerPosition,
  normalizeKeyframes
} from './helper'

describe('fixLeadingZero', () => {
  it('should returns 00 when input is 0', () => {
    const input = 0
    const expected = '00'

    expect(fixLeadingZero(input)).toBe(expected)
  })

  it('should add 0 before 1 digit number', () => {
    const input = 1
    const expected = '01'

    expect(fixLeadingZero(input)).toBe(expected)
  })

  it('should not add 0 before 10 number', () => {
    const input = 10
    const expected = '10'

    expect(fixLeadingZero(input)).toBe(expected)
  })

  it('should not add 0 before 10.001 number', () => {
    const input = 10.001
    const expected = '10'

    expect(fixLeadingZero(input)).toBe(expected)
  })

  it('should not add 0 before 10.9 number', () => {
    const input = 10.9
    const expected = '10'

    expect(fixLeadingZero(input)).toBe(expected)
  })

  it('should add 0 before 9.9 number', () => {
    const input = 9.9
    const expected = '09'

    expect(fixLeadingZero(input)).toBe(expected)
  })

  it('should not add 0 before 2 digits number', () => {
    const input = 13
    const expected = '13'

    expect(fixLeadingZero(input)).toBe(expected)
  })

  it('should not add 0 before 3 digits number', () => {
    const input = 134
    const expected = '134'

    expect(fixLeadingZero(input)).toBe(expected)
  })
})

describe('msToMinutesAndSeconds', () => {
  it('should returns 00:10 when input is 10000', () => {
    const input = 10000
    const expected = '00:10'

    expect(msToMinutesAndSeconds(input)).toBe(expected)
  })

  it('should returns 01:00 when input is 60000', () => {
    const input = 60000
    const expected = '01:00'

    expect(msToMinutesAndSeconds(input)).toBe(expected)
  })

  it('should returns 01:01 when input is 61000', () => {
    const input = 61000
    const expected = '01:01'

    expect(msToMinutesAndSeconds(input)).toBe(expected)
  })

  it('should returns 01:31 when input is 91001', () => {
    const input = 91001
    const expected = '01:31'

    expect(msToMinutesAndSeconds(input)).toBe(expected)
  })
  it('should returns 16:31 when input is 991000', () => {
    const input = 991000
    const expected = '16:31'

    expect(msToMinutesAndSeconds(input)).toBe(expected)
  })
})

describe('getMarkerPosition', () => {
  it('should returns 40% when input is 8000 of 20000', () => {
    const index = 2
    const keyframes = [{ at: 0 }, { at: 1000 }, { at: 8000 }, { at: 10000 }]
    const duration = 20000

    const expected = '40%'

    expect(getMarkerPosition(index, keyframes, duration)).toBe(expected)
  })

  it('should returns 25% when input is 10000 of 25000', () => {
    const index = 3
    const keyframes = [{ at: 0 }, { at: 1000 }, { at: 4000 }, { at: 10000 }]
    const duration = 25000

    const expected = '40%'

    expect(getMarkerPosition(index, keyframes, duration)).toBe(expected)
  })

  it('should returns 0% when input is 0 of 16000', () => {
    const index = 0
    const keyframes = [{ at: 0 }, { at: 4000 }, { at: 10000 }]
    const duration = 16000

    const expected = '0%'

    expect(getMarkerPosition(index, keyframes, duration)).toBe(expected)
  })
})

describe('normalizeKeyframes', () => {
  it('should remove last keyframe if its bigger than duration', () => {
    const keyframes = [
      { at: 0 },
      { at: 2000 },
      { at: 8000 },
      { at: 15000 },
      { at: 23000 }
    ]
    const duration = 22800

    const expected = [{ at: 0 }, { at: 2000 }, { at: 8000 }, { at: 15000 }]

    expect(normalizeKeyframes(keyframes, duration)).toStrictEqual(expected)
  })

  it('should remove all keyframes which has bigger time than duration', () => {
    const keyframes = [
      { at: 0 },
      { at: 2000 },
      { at: 8000 },
      { at: 15000 },
      { at: 23000 },
      { at: 29000 }
    ]
    const duration = 14800

    const expected = [{ at: 0 }, { at: 2000 }, { at: 8000 }]

    expect(normalizeKeyframes(keyframes, duration)).toStrictEqual(expected)
  })

  it('should remove first keyframe and remove last keyframe if its not at 0 and bigger than duration', () => {
    const keyframes = [
      { at: -100 },
      { at: 2000 },
      { at: 8000 },
      { at: 15000 },
      { at: 23000 }
    ]
    const duration = 22800

    const expected = [{ at: 2000 }, { at: 8000 }, { at: 15000 }]

    expect(normalizeKeyframes(keyframes, duration)).toStrictEqual(expected)
  })

  it('should returns keyframes if first frame is 0 and last one is smaller than duration', () => {
    const keyframes = [
      { at: 0 },
      { at: 2000 },
      { at: 8000 },
      { at: 15000 },
      { at: 23000 }
    ]
    const duration = 24800

    const expected = keyframes

    expect(normalizeKeyframes(keyframes, duration)).toStrictEqual(expected)
  })
})
