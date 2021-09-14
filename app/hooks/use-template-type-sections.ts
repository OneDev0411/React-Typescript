import { useCallback, useMemo } from 'react'

import {
  ExtendedSection,
  useMarketingCenterSections
} from '@app/hooks/use-marketing-center-sections'

interface UseMarketingTemplateTypeSections {
  getSection: (type: IMarketingTemplateType) => ExtendedSection
}

export function useTemplateTypeSections(): UseMarketingTemplateTypeSections {
  const sections = useMarketingCenterSections({ types: null })
  const sectionsList = useMemo(() => Object.values(sections), [sections])

  const getSection = useCallback(
    (type: IMarketingTemplateType) => {
      return (
        sectionsList.find(section =>
          section.items.some(item =>
            typeof item.value === 'string'
              ? item.value === type
              : item.value?.includes(type)
          )
        ) ?? sectionsList[0]
      )
    },
    [sectionsList]
  )

  return {
    getSection
  }
}
