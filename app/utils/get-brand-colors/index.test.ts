import { DEFAULT_BRAND_PALETTE } from '@app/utils/constants'
import { getBrandColors } from '@app/utils/get-brand-colors'

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
      'body-bg-color': '#ff0000',
      'container-bg-color': '#00ff00'
    }
  }
}

describe('getBrandColors', () => {
  it('should return the accumulated value of the whole brand tree colors', () => {
    const brandWithParent: IBrand = {
      ...MOCK_BRAND_1,
      parent: { ...MOCK_BRAND_2 }
    } as IBrand

    const colors = getBrandColors(brandWithParent)

    expect(colors).toContain('#ff0000')
    expect(colors).toContain('#00ff00')
  })

  it('should return a unique set of colors with no duplication', () => {
    const brandWithParent: IBrand = {
      ...MOCK_BRAND_1,
      settings: {
        marketing_palette: {
          'body-bg-color': '#ff0000',
          'container-bg-color': '#00ff00'
        }
      },
      parent: { ...MOCK_BRAND_2 }
    } as IBrand

    const colors = getBrandColors(brandWithParent)

    expect(colors).toContain('#ff0000')
    expect(colors).toContain('#00ff00')
    colors.forEach(item => {
      expect(colors.filter(item2 => item2 === item)).toHaveLength(1)
    })
  })
})
