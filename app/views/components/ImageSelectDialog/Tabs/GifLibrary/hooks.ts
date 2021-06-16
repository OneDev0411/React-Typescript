import { useEffect, useState } from 'react'

import { getTenorApiRequestUrl } from './helpers'
import { GifObject, TenorResponse } from './types'

interface UseGifLibrary {
  results: GifObject[]
  isLoading: boolean
}

export function useGifLibrary(
  searchQuery: string,
  defaultSearchQuery: string
): UseGifLibrary {
  const [results, setResults] = useState<GifObject[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    async function fetchSearchResults() {
      setIsLoading(true)

      try {
        const response = await fetch(
          getTenorApiRequestUrl('search', [
            `q=${searchQuery || defaultSearchQuery}`
          ])
        )

        const data = (await response.json()) as TenorResponse

        setResults(data.results || [])
      } catch (error) {
        console.error('Error getting search results in GIF library', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSearchResults()
  }, [searchQuery])

  return { results, isLoading }
}
