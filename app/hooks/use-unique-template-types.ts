import { useState } from 'react'
import { useDeepCompareEffect } from 'react-use'

export function useUniqueTemplateTypes(
  templates: IBrandMarketingTemplate[]
): MarketingTemplateType[] {
  const [types, setTypes] = useState<MarketingTemplateType[]>([])

  useDeepCompareEffect(() => {
    const allTypes = templates.map(item => item.template.template_type)
    const uniqueTypes = [...new Set(allTypes)]

    setTypes(uniqueTypes)
  }, [templates])

  return types
}
