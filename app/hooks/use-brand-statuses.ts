import { useState } from 'react'
import { useEffectOnce } from 'react-use'

// import { getBrandStatuses } from 'models/Deal/status/get-brand-statuses'

export function useBrandStatuses(brandId: UUID) {
  const [statuses, setStatuses] = useState<IDealStatus[]>([])

  useEffectOnce(() => {
    const fetchStatuses = async () => {
      try {
        const statuses = [] // await getBrandStatuses(brandId)

        setStatuses(statuses)
      } catch (e) {
        console.log(e)
      }
    }

    fetchStatuses()
  })

  return statuses
}
