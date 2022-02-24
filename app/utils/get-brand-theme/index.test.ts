import { getBrandTheme } from '.'

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

const MOCK_BRAND_WITHOUT_THEME: IBrand = {
  settings: {
    theme: {
      palette: {}
    }
  }
} as IBrand

const MOCK_BRAND_TREE_WITHOUT_THEME: IBrand = {
  ...MOCK_BRAND_WITHOUT_THEME,
  parent: {
    ...MOCK_BRAND_WITHOUT_THEME
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

describe('utils/get-brand-theme', () => {
  it('getBrandTheme should return an empty object if a null brand is provided', () => {
    expect(getBrandTheme(null)).toEqual({})
  })

  it('getBrandTheme should return an empty object if a null brand and host brand is provided', () => {
    expect(getBrandTheme(null, null)).toEqual({})
  })

  it('getBrandTheme should return an empty object if the passed brand has no theme and no parents', () => {
    expect(getBrandTheme(MOCK_BRAND_WITHOUT_THEME as IBrand)).toEqual({})
  })

  it('getBrandTheme should return the passed brand theme if no host brand is passed', () => {
    expect(getBrandTheme(MOCK_BRAND_WITH_THEME as IBrand)).toEqual(
      MOCK_BRAND_WITH_THEME.settings?.theme
    )
  })

  it('getBrandTheme should return an empty object if the passed brand and the parents has no theme', () => {
    expect(getBrandTheme(MOCK_BRAND_TREE_WITHOUT_THEME as IBrand)).toEqual({})
  })

  it('getBrandTheme should return the passed host brand theme if the active brand is null', () => {
    expect(getBrandTheme(null, MOCK_BRAND_WITH_THEME as IBrand)).toEqual(
      MOCK_BRAND_WITH_THEME.settings?.theme
    )
  })

  it('getBrandTheme should return the passed brand theme, if the passed brand is a descendant of the host brand', () => {
    expect(
      getBrandTheme(MOCK_BRAND_WITH_PARENT as IBrand, MOCK_PARENT_BRAND)
    ).toEqual(MOCK_BRAND_WITH_THEME.settings?.theme)
  })

  it('getBrandTheme should return the host brand theme, if the passed brand is not a descendant of the host brand', () => {
    expect(
      getBrandTheme(
        {
          ...MOCK_BRAND_WITH_PARENT,
          parent: {
            ...MOCK_PARENT_BRAND,
            id: 'wrong'
          } as IBrand
        },
        MOCK_PARENT_BRAND
      )
    ).toEqual(MOCK_BRAND_WITH_THEME.settings?.theme)
  })

  it('getBrandTheme should return the passed brand theme, if the passed brand is equal to the host brand', () => {
    expect(
      getBrandTheme(
        MOCK_BRAND_WITH_THEME as IBrand,
        MOCK_BRAND_WITH_THEME as IBrand
      )
    ).toEqual(MOCK_BRAND_WITH_THEME.settings?.theme)
  })
})
