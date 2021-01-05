import { useEffect, useState } from 'react'

import { getBrandAssets } from 'models/brand/get-brand-assets'

interface UseTeamLibrary {
  results: IBrandAsset[]
  isLoading: boolean
}

export function useTeamLibrary(
  brandId: UUID,
  searchQuery: string
): UseTeamLibrary {
  const [brandAssets, setBrandAssets] = useState<Nullable<IBrandAsset[]>>(null)
  const [results, setResults] = useState<IBrandAsset[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    async function fetchBrandAssets() {
      setIsLoading(true)

      try {
        const assets = await getBrandAssets(brandId)

        setBrandAssets(assets)
      } catch (error) {
        console.error('Error getting search results in team library', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBrandAssets()
  }, [brandId])

  useEffect(() => {
    async function searchBrandAssets() {
      if (!brandAssets) {
        return
      }

      if (!searchQuery) {
        setResults(brandAssets)
      }

      const matchingAssets = brandAssets.filter(asset =>
        asset.label.toLowerCase().includes(searchQuery.toLowerCase())
      )

      setResults(matchingAssets)
    }

    searchBrandAssets()
  }, [searchQuery, brandAssets])

  return { results, isLoading }
}
