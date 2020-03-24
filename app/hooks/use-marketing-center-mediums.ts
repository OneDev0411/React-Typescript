import { useState, useEffect } from 'react'
import _groupBy from 'lodash/groupBy'

import { onlyUnique, sortAlphabetically } from 'utils/helpers'

const HOLIDAY_TEMPLATE_TYPES = [
  'Christmas',
  'NewYear',
  'Valentines',
  'StPatrick',
  'Easter',
  'OtherHoliday'
]

function getFormattedUniqueMediums(templates: IBrandMarketingTemplate[]) {
  return templates
    .map(t => t.template.medium)
    .filter(onlyUnique)
    .sort(sortAlphabetically)
    .reverse()
}

type Mediums = {
  [key: string]: string[]
}

export function useMarketingCenterMediums(
  templates: IBrandMarketingTemplate[]
): Mediums {
  const [mediums, setMediums] = useState<Mediums>({})

  useEffect(() => {
    const groupedTemplatesByType = _groupBy(templates, i => {
      if (HOLIDAY_TEMPLATE_TYPES.includes(i.template.template_type)) {
        return 'Holiday'
      }

      return i.template.template_type
    })

    const mediums = {}

    Object.keys(groupedTemplatesByType).forEach(key => {
      mediums[key] = getFormattedUniqueMediums(groupedTemplatesByType[key])
    })

    setMediums(mediums)
  }, [templates])

  return mediums
}
