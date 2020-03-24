import { useState, useEffect } from 'react'

import { onlyUnique, sortAlphabetically } from 'utils/helpers'

export function useMarketingCenterMediums(
  templates: IBrandMarketingTemplate[]
): string[] {
  const [mediums, setMediums] = useState<string[]>([])

  useEffect(() => {
    setMediums(
      templates
        .map(brandTemplate => brandTemplate.template.medium)
        .filter(onlyUnique)
        .sort(sortAlphabetically)
        .reverse()
    )
  }, [templates])

  return mediums
}
