import { uniq } from 'lodash'

import { useState } from 'react'
import { useEffectOnce } from 'react-use'

import { getBrandChecklists } from 'models/BrandConsole/Checklists'

export function useBrandStatuses(brandId: UUID): IDealStatus[] {
  const [statuses, setStatuses] = useState<IDealStatus[]>([])

  useEffectOnce(() => {
    const fetchStatuses = async () => {
      try {
        const checklists = await getBrandChecklists(brandId)

        const statuses = uniq(
          checklists.flatMap(checklist => checklist.statuses || [])
        )

        setStatuses(statuses)
      } catch (e) {
        console.log(e)
      }
    }

    fetchStatuses()
  })

  return statuses
}
