import { useEffect, useState, useCallback } from 'react'

import { getBrandFlows } from 'models/flows/get-brand-flows'

interface GetBrandFlows {
  flows: IBrandFlow[]
  reloadFlows: () => Promise<void>
  isFetching: boolean
  error: string
}

/**
 * Fetch all flows of a brand
 */
export function useGetBrandFlows(brand: UUID | null): GetBrandFlows {
  const [flows, setFlows] = useState<IBrandFlow[]>([])
  const [error, setError] = useState('')
  const [isFetching, setIsFetching] = useState(false)

  const loadData = useCallback(
    async function loadData() {
      try {
        setIsFetching(true)

        if (brand === null) {
          setFlows([])
          setIsFetching(false)
          setError('You need to be in a team in order to get flows')
        } else {
          setFlows(await getBrandFlows(brand))
        }
      } catch (error) {
        console.log(error)
        setError(error.message)
      } finally {
        setIsFetching(false)
      }
    },
    [brand]
  )

  useEffect(() => {
    loadData()
  }, [brand, loadData])

  function reloadFlows() {
    return loadData()
  }

  return { flows, reloadFlows, isFetching, error }
}
