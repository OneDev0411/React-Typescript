import { useEffect, useState } from 'react'

import { getTenorApiRequestUrl } from './helpers'
import { GifObject, TenorResponse } from './types'

interface UseGifLibrary {
  results: GifObject[]
  isLoading: boolean
  search: (q: string) => void
}

export function useGifLibrary(): UseGifLibrary {
  const [results, setResults] = useState<GifObject[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    async function getSearchResults() {
      setIsLoading(true)

      try {
        const response = await fetch(
          getTenorApiRequestUrl('search', [`q=${searchQuery}`])
        )

        const data = (await response.json()) as TenorResponse

        setResults(data.results || [])
      } catch (error) {
        console.error('Error getting search results in GIF library', error)
      } finally {
        setIsLoading(false)
      }
    }

    async function getTrendingResults() {
      setIsLoading(true)

      try {
        const response = await fetch(getTenorApiRequestUrl('trending'))

        const data = (await response.json()) as TenorResponse

        setResults(data.results || [])
      } catch (error) {
        console.error('Error getting trending results in GIF library', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (searchQuery) {
      getSearchResults()
    } else {
      getTrendingResults()
    }
  }, [searchQuery])

  function search(query: string) {
    setSearchQuery(query)
  }

  return { results, isLoading, search }
}
