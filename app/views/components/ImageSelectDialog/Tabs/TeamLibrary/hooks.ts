import { useEffect, useState } from 'react'

import { useActiveBrandId } from '@app/hooks/brand/use-active-brand-id'
import { deleteBrandAsset } from 'models/brand/delete-brand-asset'
import { getBrandAssets } from 'models/brand/get-brand-assets'
import { uploadBrandAsset } from 'models/brand/upload-asset'

import { DEFAULT_ASSET_LABEL } from './constants'

interface UseTeamLibrary {
  results: IBrandAsset[]
  labels: string[]
  isLoading: boolean
  isUploading: boolean
  hasDeleteAccess: (assetId: UUID) => boolean
  deleteAsset: (assetId: UUID) => Promise<void>
  uploadAsset: (file: File, label: string) => Promise<IBrandAsset>
}

export function useTeamLibrary(
  brandId: UUID,
  searchQuery: string,
  filterFn?: (asset: IBrandAsset) => boolean
): UseTeamLibrary {
  const activeBrandId = useActiveBrandId()

  const [brandAssets, setBrandAssets] = useState<Nullable<IBrandAsset[]>>(null)
  const [results, setResults] = useState<IBrandAsset[]>([])
  const [labels, setLabels] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isUploading, setIsUploading] = useState<boolean>(false)

  const hasDeleteAccess = (assetId: UUID) => {
    if (!brandAssets || !activeBrandId) {
      return false
    }

    const asset = brandAssets.find(asset => asset.id === assetId)

    if (!asset) {
      return false
    }

    return asset.brand === activeBrandId
  }

  const deleteAsset = async (assetId: UUID): Promise<void> => {
    if (!brandAssets || !hasDeleteAccess(assetId)) {
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
    setIsUploading(true)

    const currentBrandAssets = brandAssets ?? []

    const newUploadedAssets = await uploadBrandAsset([brandId], file, {
      label
    })

    const uploadedAsset = newUploadedAssets[0]

    setBrandAssets([uploadedAsset, ...currentBrandAssets])

    setIsUploading(false)

    return uploadedAsset
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

      const filteredBrandAssets = filterFn
        ? brandAssets.filter(asset => filterFn(asset))
        : brandAssets

      if (!searchQuery) {
        setResults(filteredBrandAssets)

        return
      }

      const matchingAssets = filteredBrandAssets.filter(asset =>
        asset.label.toLowerCase().includes(searchQuery.toLowerCase())
      )

      setResults(matchingAssets)
    }

    searchBrandAssets()
  }, [searchQuery, filterFn, brandAssets])

  useEffect(() => {
    if (!brandAssets) {
      setLabels([])

      return
    }

    const newLabels = [...new Set(brandAssets.map(asset => asset.label))].sort(
      (a, b) => {
        if (a === DEFAULT_ASSET_LABEL) {
          return -1
        }

        if (b === DEFAULT_ASSET_LABEL) {
          return 1
        }

        const loweredA = a.toLowerCase()
        const loweredB = b.toLowerCase()

        return loweredA.localeCompare(loweredB)
      }
    )

    setLabels(newLabels)
  }, [brandAssets])

  return {
    results,
    labels,
    isLoading,
    isUploading,
    hasDeleteAccess,
    deleteAsset,
    uploadAsset
  }
}
