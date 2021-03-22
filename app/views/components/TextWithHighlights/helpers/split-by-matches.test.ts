import { splitByMatches } from 'components/TextWithHighlights/helpers/split-by-matches'

describe('splitByMatches', () => {
  it('should work when some matches exist', () => {
    const regExp = new RegExp('e', 'gi')
    const result = splitByMatches(regExp, 'Sayed Alireza Mirian')

    expect(result).toEqual([
      {
        text: 'Say',
        match: false
      },
      {
        text: 'e',
        match: true
      },
      {
        text: 'd Alir',
        match: false
      },
      {
        text: 'e',
        match: true
      },
      {
        text: 'za Mirian',
        match: false
      }
    ])
  })

  // it('should work when nothing is matched', () => {
  //   const regExp = new RegExp('never matches', 'gi')
  //   const result = splitByMatches(regExp, 'Sayed Alireza Mirian')

  //   expect(result).toEqual([
  //     {
  //       text: 'Sayed Alireza Mirian',
  //       match: false
  //     }
  //   ])
  // })

  it('should work when a match is in the start', () => {
    const regExp = new RegExp('Sayed', 'gi')
    const result = splitByMatches(regExp, 'Sayed Alireza Mirian')

    expect(result).toEqual([
      {
        text: 'Sayed',
        match: true
      },
      {
        text: ' Alireza Mirian',
        match: false
      }
    ])
  })
  it('should work when a match is at the end', () => {
    const regExp = new RegExp('Mirian', 'gi')
    const result = splitByMatches(regExp, 'Sayed Alireza Mirian')

    expect(result).toEqual([
      {
        text: 'Sayed Alireza ',
        match: false
      },
      {
        text: 'Mirian',
        match: true
      }
    ])
  })
})
