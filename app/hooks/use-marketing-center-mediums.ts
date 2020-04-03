import { useState, useEffect } from 'react'
import _groupBy from 'lodash/groupBy'

import { onlyUnique, sortAlphabetically } from 'utils/helpers'

type Response = {
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
): Response {
  const [mediums, setMediums] = useState<Response>({})

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
    const mediums = {}

    Object.keys(groupByType).forEach(key => {
      mediums[key] = sanitizeMediums(groupByType[key])
    })

    setMediums(mediums)
  }, [templates])

  return mediums
}
