import { hasBrandCustomTheme, isBrandUnderAncestor } from '.'

const MOCK_BRAND_WITH_THEME: IBrand = {
  settings: {
    theme: {
      palette: {
        primary: {
          // @ts-ignore
          main: '#333333'
        }
      }
    }
  }
} as IBrand

const MOCK_BRAND_WITH_SIDE_NAV_LOGO: IBrand = {
  settings: {
    theme: {
      // @ts-ignore
      navbar: {
        logo: {
          url: 'my-logo.png'
        }
      }
    }
  }
} as IBrand

const MOCK_BRAND_WITHOUT_THEME: IBrand = {
  settings: {
    theme: {
      palette: {}
    }
  }
} as IBrand

const MOCK_PARENT_BRAND: IBrand = {
  ...MOCK_BRAND_WITH_THEME,
  id: '1'
} as IBrand

const MOCK_BRAND_WITH_PARENT: IBrand = {
  ...MOCK_BRAND_WITH_THEME,
  id: '2',
  parent: { ...MOCK_PARENT_BRAND }
} as IBrand

describe('utils/brand', () => {
  it('hasBrandCustomTheme should return false when the brand has no theme', () => {
    expect(hasBrandCustomTheme(MOCK_BRAND_WITHOUT_THEME as IBrand)).toBe(false)
  })

  it('hasBrandCustomTheme should return true when the brand has theme', () => {
    expect(hasBrandCustomTheme(MOCK_BRAND_WITH_THEME as IBrand)).toBe(true)
  })

  it('hasBrandCustomTheme should return true when the brand has only navbar logo', () => {
    expect(hasBrandCustomTheme(MOCK_BRAND_WITH_SIDE_NAV_LOGO)).toBe(true)
  })

  it('isBrandUnderAncestor should return true if a brand is a descendant of another brand', () => {
    expect(
      isBrandUnderAncestor(MOCK_BRAND_WITH_PARENT, MOCK_PARENT_BRAND)
    ).toBe(true)
  })

  it('isBrandUnderAncestor should return false if a brand is not descendant of another brand', () => {
    expect(
      isBrandUnderAncestor(MOCK_BRAND_WITH_PARENT, {
        ...MOCK_PARENT_BRAND,
        id: '3'
      } as IBrand)
    ).toBe(false)
  })
})
