import { useState } from 'react'
import { useDeepCompareEffect } from 'react-use'

export function useUniqueMediums(
  templates: IBrandMarketingTemplate[]
): IMarketingTemplateMedium[] {
  const [mediums, setMediums] = useState<IMarketingTemplateMedium[]>([])

  useDeepCompareEffect(() => {
    const allMediums = templates.map(item => item.template.medium)
    const uniqueMediums = [...new Set(allMediums)]

    setMediums(uniqueMediums)
  }, [templates])

  return mediums
}
