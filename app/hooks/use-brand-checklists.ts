import { useEffect, useState } from 'react'

import { getBrandChecklists } from '../models/BrandConsole/Checklists'

export function useBrandChecklists(brandId: UUID): IBrandChecklist[] {
  const [brandChecklists, setBrandChecklists] = useState<IBrandChecklist[]>([])

  useEffect(() => {
    const fetch = async () => {
      try {
        const list = await getBrandChecklists(brandId)

        setBrandChecklists(list)
      } catch (e) {
        setBrandChecklists([])
      }
    }

    brandId && fetch()
  }, [brandId])

  return brandChecklists
}
