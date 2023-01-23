import { useMemo } from 'react'

import { useMarketingCenterSectionItems } from '@app/hooks/use-marketing-center-section-items'
import { getTemplateTypeLabel } from '@app/utils/marketing-center/get-template-type-label'
import { TemplateTypeWithMedium } from '@app/views/components/MarketingSearchInput/types'

export function useMarketingTemplateTypesWithMediums(
  categories: IMarketingTemplateCategories
): TemplateTypeWithMedium[] {
  const sectionItems = useMarketingCenterSectionItems()

  const templateTypes = useMemo(() => {
    const categoriesWithTemplateType = sectionItems.filter(
      category => !!category.value
    )

    return categoriesWithTemplateType.flatMap<IMarketingTemplateType>(
      category => category.value!
    )
  }, [sectionItems])

  return useMemo(
    () =>
      templateTypes.flatMap(templateType => {
        const currentTypeMediums = categories[templateType]?.mediums || []

        // Only categories with content should be displayed
        if (currentTypeMediums.length) {
          return currentTypeMediums.map(medium => ({
            type: templateType,
            label:
              categories[templateType]?.label ||
              getTemplateTypeLabel(templateType),
            medium
          }))
        }

        return []
      }),
    [categories, templateTypes]
  )
}
