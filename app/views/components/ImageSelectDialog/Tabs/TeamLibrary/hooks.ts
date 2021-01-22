import { useEffect, useState } from 'react'

import { getActiveTeamId } from 'utils/user-teams'
import { getBrandAssets } from 'models/brand/get-brand-assets'
import { deleteBrandAsset } from 'models/brand/delete-brand-asset'
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
  user: IUser,
  searchQuery: string
): UseTeamLibrary {
  const [brandAssets, setBrandAssets] = useState<Nullable<IBrandAsset[]>>(null)
  const [results, setResults] = useState<IBrandAsset[]>([])
  const [labels, setLabels] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isUploading, setIsUploading] = useState<boolean>(false)

  const activeBrandId = getActiveTeamId(user)

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

    const newUploadedAsset = await uploadBrandAsset(brandId, file, label)

    setBrandAssets([newUploadedAsset, ...currentBrandAssets])

    setIsUploading(false)

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
