import { DEFAULT_BRAND_PALETTE } from '@app/utils/constants'
import { get } from '@app/views/components/InstantMarketing/helpers/nunjucks-functions'

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
      'body-bg-color': '#aabbcc'
    }
  }
}

const MOCK_BRAND_WITHOUT_PALETTE: DeepPartial<IBrand> = {}

describe('nunjucks-functions/get', () => {
  it("should return the value from the brand itself if it's available on the brand", () => {
    const brandWithParent: IBrand = {
      ...MOCK_BRAND_2,
      parent: {
        ...MOCK_BRAND_1
      }
    } as IBrand

    const brandWithoutParent: IBrand = {
      ...MOCK_BRAND_2
    } as IBrand

    expect(get(brandWithParent, 'body-bg-color')).toBe('#aabbcc')
    expect(get(brandWithoutParent, 'body-bg-color')).toBe('#aabbcc')
  })

  it('should return default fallback value for the brands without palette', () => {
    const brandWithoutPalette: IBrand = {
      ...MOCK_BRAND_WITHOUT_PALETTE
    } as IBrand

    expect(get(brandWithoutPalette, 'body-bg-color')).toBe(
      DEFAULT_BRAND_PALETTE['body-bg-color']
    )
  })

  it("should return the value from the parent brand if it's not available on the brand itself", () => {
    const brandWithParent: IBrand = {
      ...MOCK_BRAND_1,
      parent: {
        ...MOCK_BRAND_2
      }
    } as IBrand

    expect(get(brandWithParent, 'body-bg-color')).not.toBe('#aabbcc')
    expect(get(brandWithParent, 'body-bg-color')).toBe(
      DEFAULT_BRAND_PALETTE['body-bg-color']
    )
  })

  it('should not count null or undefined values as proper values on brands with null keys', () => {
    const brandWithNullPalette: IBrand = {
      ...MOCK_BRAND_1,
      settings: {
        marketing_palette: null
      },
      parent: {
        ...MOCK_BRAND_2
      }
    } as IBrand

    // @ts-ignore
    const brandWithUndefinedPalette: IBrand = {
      ...MOCK_BRAND_1,
      settings: {
        marketing_palette: undefined
      },
      parent: {
        ...MOCK_BRAND_2
      }
    } as IBrand

    // @ts-ignore
    const brandWithNullKeyInPalette: IBrand = {
      ...MOCK_BRAND_1,
      settings: {
        marketing_palette: {
          ...DEFAULT_BRAND_PALETTE,
          'body-bg-color': null
        }
      },
      parent: {
        ...MOCK_BRAND_2
      }
    } as IBrand

    // @ts-ignore
    const brandWithUndefinedKeyInPalette: IBrand = {
      ...MOCK_BRAND_1,
      settings: {
        marketing_palette: {
          ...DEFAULT_BRAND_PALETTE,
          'body-bg-color': null
        }
      },
      parent: {
        ...MOCK_BRAND_2
      }
    } as IBrand

    expect(get(brandWithNullPalette, 'body-bg-color')).toBe('#aabbcc')
    expect(get(brandWithUndefinedPalette, 'body-bg-color')).toBe('#aabbcc')
    expect(get(brandWithNullKeyInPalette, 'body-bg-color')).toBe('#aabbcc')
    expect(get(brandWithUndefinedKeyInPalette, 'body-bg-color')).toBe('#aabbcc')
  })
})
