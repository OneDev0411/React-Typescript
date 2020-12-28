import { useEffect, useState } from 'react'

import { listImages, searchImages } from './helpers'
import { Image } from './types'

interface UsePhotoLibrary {
  results: Image[]
  isLoading: boolean
  search: (q: string) => void
}

export function usePhotoLibrary(): UsePhotoLibrary {
  const [results, setResults] = useState<Image[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    async function getSearchResults() {
      setIsLoading(true)

      try {
        const images = await searchImages(searchQuery)

        setResults(images)
      } catch (error) {
        console.error('Error getting search results in photo library', error)
      } finally {
        setIsLoading(false)
      }
    }

    async function getTrendingResults() {
      setIsLoading(true)

      try {
        const images = await listImages()

        setResults(images)
      } catch (error) {
        console.error('Error getting trending results in photo library', error)
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
