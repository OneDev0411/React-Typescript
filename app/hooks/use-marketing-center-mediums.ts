import { useState, useEffect } from 'react'
import _groupBy from 'lodash/groupBy'

import { onlyUnique, sortAlphabetically } from 'utils/helpers'

function getFormattedUniqueMediums(
  templates: IBrandMarketingTemplate[]
): MarketingTemplateMedium[] {
  return templates
    .map(t => t.template.medium)
    .filter(onlyUnique)
    .sort(sortAlphabetically)
    .reverse()
}

type TemplateTypeToMediumsMap = {
  [key: string]: MarketingTemplateMedium[]
}

export function useMarketingCenterMediums(
  templates: IBrandMarketingTemplate[]
): TemplateTypeToMediumsMap {
  const [mediums, setMediums] = useState<TemplateTypeToMediumsMap>({})

  useEffect(() => {
    if (!templates || templates.length === 0) {
      return
    }

    const groupedTemplatesByType = _groupBy(templates, i => {
      return i.template.template_type
    })

    const newMediums: TemplateTypeToMediumsMap = {}

    Object.keys(groupedTemplatesByType).forEach(key => {
      newMediums[key] = getFormattedUniqueMediums(groupedTemplatesByType[key])
    })

    setMediums(newMediums)
  }, [templates])

  return mediums
}
