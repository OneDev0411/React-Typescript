import { uniq } from 'lodash'

import { getBrandColors } from '@app/utils/get-brand-colors'

import { useBrand } from './use-brand'

export function useAvailableColors(defaultColors: string[]) {
  const brand = useBrand()

  if (!brand) {
    return []
  }

  return uniq([
    'transparent',
    '#ffffff',
    ...defaultColors,
    ...getBrandColors(brand)
  ])
}
