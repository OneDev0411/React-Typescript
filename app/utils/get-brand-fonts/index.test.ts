import { DEFAULT_BRAND_PALETTE } from '@app/utils/constants'
import { getBrandFontFamilies } from '@app/utils/get-brand-fonts'

const MOCK_BRAND_1: DeepPartial<IBrand> = {
  settings: {
    marketing_palette: {
      ...DEFAULT_BRAND_PALETTE
    }
  }
}

const MOCK_BRAND_2: DeepPartial<IBrand> = {
  settings: {
    marketing_palette: {
      ...DEFAULT_BRAND_PALETTE,
      'h1-font-family': 'h1',
      'h2-font-family': 'h2',
      'h3-font-family': 'h3'
    }
  }
}

describe('getBrandFontFamilies', () => {
  it('should return the accumulated value of the whole brand tree fonts', () => {
    const brandWithParent: IBrand = {
      ...MOCK_BRAND_1,
      parent: { ...MOCK_BRAND_2 }
    } as IBrand

    const fontFamilies = getBrandFontFamilies(brandWithParent)

    expect(fontFamilies).toContain('h1')
    expect(fontFamilies).toContain('h2')
    expect(fontFamilies).toContain('h3')
  })

  it('should return a unique set of font families with no duplication', () => {
    const brandWithParent: IBrand = {
      ...MOCK_BRAND_1,
      settings: {
        marketing_palette: {
          'h1-font-family': 'h1',
          'h2-font-family': 'h2',
          'h3-font-family': 'H3'
        }
      },
      parent: { ...MOCK_BRAND_2 }
    } as IBrand

    const fontFamilies = getBrandFontFamilies(brandWithParent)

    expect(fontFamilies).toContain('h1')
    expect(fontFamilies).toContain('h2')
    expect(fontFamilies).toContain('h3')
    expect(fontFamilies).toContain('H3')
    fontFamilies.forEach(item => {
      expect(fontFamilies.filter(item2 => item2 === item)).toHaveLength(1)
    })
  })
})
