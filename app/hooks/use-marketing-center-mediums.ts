import { useState, useEffect } from 'react'
import _groupBy from 'lodash/groupBy'

import { onlyUnique, sortAlphabetically } from 'utils/helpers'

type Mediums = {
  [key: string]: string[]
}

function sanitizeMediums(templates: IMarketingTemplate[]) {
  return templates
    .map(t => t.medium)
    .filter(onlyUnique)
    .sort(sortAlphabetically)
    .reverse()
}

export function useMarketingCenterMediums(
  templates: IMarketingTemplate[]
): Mediums {
  const [mediums, setMediums] = useState<Mediums>({})

  useEffect(() => {
    const groupHoliday = [
      'Christmas',
      'NewYear',
      'Valentines',
      'StPatrick',
      'Easter',
      'OtherHoliday'
    ]
    const groupByType = _groupBy(templates, i => {
      if (groupHoliday.includes(i.template_type)) {
        return 'Holiday'
      }

      return i.template_type
    })
    const nextMediums: Mediums = {}

    Object.keys(groupByType).forEach(key => {
      nextMediums[key] = sanitizeMediums(groupByType[key])
    })

    setMediums(nextMediums)
  }, [templates])

  return mediums
}
