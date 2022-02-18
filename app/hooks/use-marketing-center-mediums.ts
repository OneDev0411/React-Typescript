import { useState } from 'react'

import _groupBy from 'lodash/groupBy'
import { useDeepCompareEffect } from 'react-use'

import { notNull } from '@app/utils/ts-utils'
import { onlyUnique, sortAlphabetically } from 'utils/helpers'

function getFormattedUniqueMediums(
  templatesOrAssets: (IBrandMarketingTemplate | IBrandAsset)[]
): IMarketingTemplateMedium[] {
  const mediums = templatesOrAssets
    .map(templateOrAsset => {
      return templateOrAsset.type === 'brand_template'
        ? templateOrAsset.template.medium
        : templateOrAsset.medium
    })
    .filter(notNull)

  return mediums.filter(onlyUnique).sort(sortAlphabetically).reverse()
}

export type TemplateTypeToMediumsMap = {
  [key: string]: IMarketingTemplateMedium[]
}

export function useMarketingCenterMediums(
  templates: IBrandMarketingTemplate[],
  brandAssets: IBrandAsset[] = []
): TemplateTypeToMediumsMap {
  const [mediums, setMediums] = useState<TemplateTypeToMediumsMap>({})

  useDeepCompareEffect(() => {
    if (
      (!templates || templates.length === 0) &&
      (!brandAssets || brandAssets.length === 0)
    ) {
      setMediums({})

      return
    }

    const groupedTemplatesAndAssetsByType = _groupBy(
      [...templates, ...brandAssets],
      i => {
        return i.type === 'brand_template'
          ? i.template.template_type
          : i.template_type
      }
    )

    const newMediums: TemplateTypeToMediumsMap = {}

    Object.keys(groupedTemplatesAndAssetsByType).forEach(key => {
      newMediums[key] = getFormattedUniqueMediums(
        groupedTemplatesAndAssetsByType[key]
      )
    })

    setMediums(newMediums)
  }, [templates, brandAssets])

  return mediums
}
