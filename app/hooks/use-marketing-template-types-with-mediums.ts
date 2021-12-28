import { useMemo } from 'react'

import { useMarketingCenterCategories } from '@app/hooks/use-marketing-center-categories'
import { useMarketingCenterMediums } from '@app/hooks/use-marketing-center-mediums'

interface TypeWithMedium {
  type: IMarketingTemplateType
  medium?: IMarketingTemplateMedium
}

export function useMarketingTemplateTypesWithMediums(
  templates: IBrandMarketingTemplate[],
  assets: IBrandAsset[] = []
): TypeWithMedium[] {
  const categories = useMarketingCenterCategories()

  const templateTypes = useMemo(() => {
    const categoriesWithTemplateType = categories.filter(
      category => !!category.value
    )

    return categoriesWithTemplateType.flatMap<IMarketingTemplateType>(
      category => category.value!
    )
  }, [categories])

  const mediums = useMarketingCenterMediums(templates, assets)

  return useMemo(
    () =>
      templateTypes.flatMap(templateType => {
        const currentTypeMediums = mediums[templateType]

        if (!currentTypeMediums) {
          return { type: templateType }
        }

        return currentTypeMediums.map(medium => ({
          type: templateType,
          medium
        }))
      }),
    [mediums, templateTypes]
  )
}
