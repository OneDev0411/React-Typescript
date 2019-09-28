import isEqual from 'lodash/isEqual'
import { useEffect, useState } from 'react'
import usePrevious from 'react-use/lib/usePrevious'

import { getMlsSubAreas } from 'models/listings/search/get-mls-sub-areas'

export function useGetMlsSubArea(
  areas: number[]
): {
  error: string
  subAreas: IMLSArea[]
  isLoadingSubAreas: boolean
} {
  const prevAreas = usePrevious(areas)
  const [error, setError] = useState<string>('')
  const [subAreas, setSubAreas] = useState<IMLSArea[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    async function fetch() {
      try {
        setIsLoading(true)

        const subAreas = await getMlsSubAreas(areas)

        setSubAreas(subAreas)
      } catch (error) {
        console.log(error)
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    if (areas.length > 0 && !isEqual(areas, prevAreas)) {
      fetch()
    }
  }, [areas, prevAreas])

  return { error, subAreas, isLoadingSubAreas: isLoading }
}
