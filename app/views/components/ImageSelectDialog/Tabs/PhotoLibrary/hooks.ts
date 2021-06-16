import { useEffect, useState } from 'react'

import { searchImages } from './helpers'
import { Image } from './types'

interface UsePhotoLibrary {
  results: Image[]
  isLoading: boolean
}

export function usePhotoLibrary(
  searchQuery: string,
  defaultSearchQuery: string
): UsePhotoLibrary {
  const [results, setResults] = useState<Image[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    async function fetchSearchResults() {
      setIsLoading(true)

      try {
        const images = await searchImages(searchQuery || defaultSearchQuery)

        setResults(images)
      } catch (error) {
        console.error('Error getting search results in photo library', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSearchResults()
  }, [searchQuery, defaultSearchQuery])

  return { results, isLoading }
}
