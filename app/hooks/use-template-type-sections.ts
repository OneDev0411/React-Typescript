import { useCallback, useMemo } from 'react'

import {
  ExtendedSection,
  useMarketingCenterSections
} from '@app/hooks/use-marketing-center-sections'

interface UseMarketingTemplateTypeSections {
  getSection: (type: IMarketingTemplateType) => ExtendedSection
}

export function useTemplateTypeSections(): UseMarketingTemplateTypeSections {
  const sections = useMarketingCenterSections(null)
  const sectionsList = useMemo(() => Object.values(sections), [sections])

  const getSection = useCallback(
    (type: IMarketingTemplateType) => {
      return (
        sectionsList.find(section =>
          section.items.some(item => item.value === type)
        ) ?? sectionsList[0]
      )
    },
    [sectionsList]
  )

  return {
    getSection
  }
}
