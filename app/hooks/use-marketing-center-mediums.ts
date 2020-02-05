import { useState, useEffect } from 'react'

import { onlyUnique, sortAlphabetically } from 'utils/helpers'

export function useMarketingCenterMediums(
  templates: IMarketingTemplate[]
): string[] {
  const [mediums, setMediums] = useState<string[]>([])

  useEffect(() => {
    setMediums(
      templates
        .map(t => t.medium)
        .filter(onlyUnique)
        .sort(sortAlphabetically)
        .reverse()
    )
  }, [templates])

  return mediums
}
