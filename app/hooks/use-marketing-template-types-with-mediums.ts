import { useMemo } from 'react'

import { useMarketingCenterSectionItems } from '@app/hooks/use-marketing-center-section-items'

interface TypeWithMedium {
  type: IMarketingTemplateType
  medium?: IMarketingTemplateMedium
}

export function useMarketingTemplateTypesWithMediums(
  categories: IMarketingTemplateCategories
): TypeWithMedium[] {
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
        const currentTypeMediums = categories[
          templateType
        ] as IMarketingTemplateMedium[]

        // Only categories with content should be displayed
        if (currentTypeMediums?.length) {
          return currentTypeMediums.map(medium => ({
            type: templateType,
            medium
          }))
        }

        return []
      }),
    [categories, templateTypes]
  )
}
