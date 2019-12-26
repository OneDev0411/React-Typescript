import { SectionItem } from 'components/PageSideNav/types'

import { useMarketingCenterSections } from 'hooks/use-marketing-center-sections'

export function useMarketingCenterCategories(): SectionItem[] {
  const allSections = useMarketingCenterSections()

  return allSections.reduce((prev, curr) => {
    // We don't need my designs section
    return [...prev, ...curr.items.filter(item => !item.isIndex)]
  }, [])
}
