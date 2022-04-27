import { getBrandLogo } from '.'

const MOCK_BRAND_WITH_LOGO: IBrand = {
  settings: {
    theme: {
      navbar: {
        logo: {
          url: 'my-logo.png'
        }
      }
    }
  }
} as IBrand

const MOCK_BRAND_WITHOUT_LOGO: IBrand = {
  settings: {
    theme: {}
  }
} as IBrand

const MOCK_BRAND_TREE_WITHOUT_LOGO: IBrand = {
  ...MOCK_BRAND_WITHOUT_LOGO,
  parent: {
    ...MOCK_BRAND_WITHOUT_LOGO
  }
} as IBrand

const MOCK_PARENT_BRAND: IBrand = {
  ...MOCK_BRAND_WITH_LOGO,
  id: '1'
} as IBrand

const MOCK_BRAND_WITH_PARENT: IBrand = {
  ...MOCK_BRAND_WITH_LOGO,
  id: '2',
  parent: { ...MOCK_PARENT_BRAND }
} as IBrand

const DEFAULT_LOGO = '/static/images/logo.svg'

describe('utils/get-brand-logo', () => {
  it('getBrandLogo should return the default logo if the brand tree does not have the logo', () => {
    expect(getBrandLogo(null, null, 'default-logo')).toEqual('default-logo')
    expect(
      getBrandLogo(MOCK_BRAND_TREE_WITHOUT_LOGO, null, 'default-logo')
    ).toEqual('default-logo')
  })

  it('getBrandLogo should return the logo if the brand tree have the logo', () => {
    expect(getBrandLogo(MOCK_BRAND_WITH_PARENT, null, 'default-logo')).toEqual(
      MOCK_BRAND_WITH_PARENT.settings?.theme?.navbar?.logo?.url
    )
  })

  it('getBrandLogo should return the default logo if a null brand is provided', () => {
    expect(getBrandLogo(null)).toEqual(DEFAULT_LOGO)
  })

  it('getBrandLogo should return the default logo if a null brand and host brand is provided', () => {
    expect(getBrandLogo(null, null)).toEqual(DEFAULT_LOGO)
  })

  it('getBrandLogo should return the default logo if the passed brand has no theme and no parents', () => {
    expect(getBrandLogo(MOCK_BRAND_WITHOUT_LOGO as IBrand)).toEqual(
      DEFAULT_LOGO
    )
  })

  it('getBrandLogo should return the passed brand logo if no host brand is passed', () => {
    expect(getBrandLogo(MOCK_BRAND_WITH_LOGO as IBrand)).toEqual(
      MOCK_BRAND_WITH_LOGO.settings?.theme?.navbar?.logo?.url
    )
  })

  it('getBrandLogo should return the default logo if the passed brand and the parents has no theme', () => {
    expect(getBrandLogo(MOCK_BRAND_TREE_WITHOUT_LOGO as IBrand)).toEqual(
      DEFAULT_LOGO
    )
  })

  it('getBrandLogo should return the passed host brand logo if the active brand is null', () => {
    expect(getBrandLogo(null, MOCK_BRAND_WITH_LOGO as IBrand)).toEqual(
      MOCK_BRAND_WITH_LOGO.settings?.theme?.navbar?.logo?.url
    )
  })

  it('getBrandLogo should return the passed brand logo, if the passed brand is a descendant of the host brand', () => {
    expect(
      getBrandLogo(MOCK_BRAND_WITH_PARENT as IBrand, MOCK_PARENT_BRAND)
    ).toEqual(MOCK_BRAND_WITH_LOGO.settings?.theme?.navbar?.logo?.url)
  })

  it('getBrandLogo should return the host brand logo, if the passed brand is not a descendant of the host brand', () => {
    expect(
      getBrandLogo(MOCK_BRAND_WITH_PARENT as IBrand, {
        ...MOCK_PARENT_BRAND,
        id: 'wrong'
      })
    ).toEqual(MOCK_PARENT_BRAND.settings?.theme?.navbar?.logo?.url)
  })

  it('getBrandLogo should return the passed brand logo, if the passed brand is equal to the host brand', () => {
    expect(
      getBrandLogo(
        MOCK_BRAND_WITH_LOGO as IBrand,
        MOCK_BRAND_WITH_LOGO as IBrand
      )
    ).toEqual(MOCK_BRAND_WITH_LOGO.settings?.theme?.navbar?.logo?.url)
  })
})
