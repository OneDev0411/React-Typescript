import _values from 'lodash/values'

import { SectionItem } from 'components/PageSideNav/types'

import { useMarketingCenterSections } from 'hooks/use-marketing-center-sections'

export function useMarketingCenterCategories(): SectionItem[] {
  const allSections = _values(useMarketingCenterSections({ types: null }))

  return allSections.reduce((prev, curr) => {
    // We don't need all designs section
    return [...prev, ...curr.items.filter(item => !item.isIndex)]
  }, [])
}
