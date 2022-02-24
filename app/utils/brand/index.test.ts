import { hasBrandCustomTheme, isBrandADescendantOfAnotherBrand } from '.'

const MOCK_BRAND_WITH_THEME: DeepPartial<IBrand> = {
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
}

const MOCK_BRAND_WITHOUT_THEME: DeepPartial<IBrand> = {
  settings: {
    theme: {
      palette: {}
    }
  }
}

const MOCK_PARENT_BRAND: IBrand = {
  id: '1',
  ...MOCK_BRAND_WITH_THEME
} as IBrand

const MOCK_BRAND_WITH_PARENT: IBrand = {
  id: '2',
  ...MOCK_BRAND_WITH_THEME,
  parent: { ...MOCK_PARENT_BRAND }
} as IBrand

describe('utils/brand', () => {
  it('hasBrandCustom theme should return false when the brand has no theme', () => {
    expect(hasBrandCustomTheme(MOCK_BRAND_WITHOUT_THEME as IBrand)).toBe(false)
  })

  it('hasBrandCustom theme should return true when the brand has theme', () => {
    expect(hasBrandCustomTheme(MOCK_BRAND_WITH_THEME as IBrand)).toBe(true)
  })

  it('isBrandADescendantOfAnotherBrand should return true if a brand is a descendant of another brand', () => {
    expect(
      isBrandADescendantOfAnotherBrand(
        MOCK_BRAND_WITH_PARENT,
        MOCK_PARENT_BRAND
      )
    ).toBe(true)
  })

  it('isBrandADescendantOfAnotherBrand should return false if a brand is not descendant of another brand', () => {
    expect(
      isBrandADescendantOfAnotherBrand(MOCK_BRAND_WITH_PARENT, {
        ...MOCK_PARENT_BRAND,
        id: '3'
      } as IBrand)
    ).toBe(false)
  })
})
