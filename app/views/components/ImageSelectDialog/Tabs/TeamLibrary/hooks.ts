import { useEffect, useState } from 'react'

import { getBrandAssets } from 'models/brand/get-brand-assets'
import { deleteBrandAsset } from 'models/brand/delete-brand-asset'
import { uploadBrandAsset } from 'models/brand/upload-asset'

interface UseTeamLibrary {
  results: IBrandAsset[]
  labels: string[]
  isLoading: boolean
  deleteAsset: (assetId: UUID) => Promise<void>
  uploadAsset: (file: File, label: string) => Promise<IBrandAsset>
}

export function useTeamLibrary(
  brandId: UUID,
  searchQuery: string
): UseTeamLibrary {
  const [brandAssets, setBrandAssets] = useState<Nullable<IBrandAsset[]>>(null)
  const [results, setResults] = useState<IBrandAsset[]>([])
  const [labels, setLabels] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const deleteAsset = async (assetId: UUID): Promise<void> => {
    if (!brandAssets) {
      return
    }

    const newBrandAssets = brandAssets.filter(asset => asset.id !== assetId)

    setBrandAssets(newBrandAssets)

    await deleteBrandAsset(brandId, assetId)
  }

  const uploadAsset = async (
    file: File,
    label: string
  ): Promise<IBrandAsset> => {
    setIsLoading(true)

    const currentBrandAssets = brandAssets ?? []

    const newUploadedAsset = await uploadBrandAsset(brandId, file, label)

    setBrandAssets([...currentBrandAssets, newUploadedAsset])

    setIsLoading(false)

    return newUploadedAsset
  }

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

  useEffect(() => {
    if (!brandAssets) {
      setLabels([])

      return
    }

    const newLabels = [...new Set(brandAssets.map(asset => asset.label))]

    setLabels(newLabels)
  }, [brandAssets])

  return { isLoading, results, labels, deleteAsset, uploadAsset }
}
