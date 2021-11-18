import { useState, useCallback } from 'react'

import { useDeepCompareEffect } from 'react-use'

import { deleteBrandAsset } from '@app/models/brand/delete-brand-asset'
import { getBrandAssets } from '@app/models/brand/get-brand-assets'

interface Options {
  templateTypes?: IMarketingTemplateType[]
  medium?: IMarketingTemplateMedium
}

interface UseBrandAssets {
  search: (query: string) => void
  delete: (asset: IBrandAsset) => Promise<void>
  refetch: () => void
  hasDeleteAccess: (asset: IBrandAsset) => boolean
  assets: IBrandAsset[]
  isLoading: boolean
}

export function useBrandAssets(
  brandId: UUID,
  options: Options
): UseBrandAssets {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [allAssets, setAllAssets] = useState<IBrandAsset[]>([])
  const [assets, setAssets] = useState<IBrandAsset[]>([])

  const fetchAssets = async () => {
    setIsLoading(true)

    const fetchedAssets = await getBrandAssets(brandId, options)

    setAllAssets(fetchedAssets)
    setAssets(fetchedAssets)
    setIsLoading(false)
  }

  const hasDeleteAccess = (asset: IBrandAsset) => {
    if (!assets || !brandId) {
      return false
    }

    const foundAsset = assets.find(item => item.id === asset.id)

    if (!foundAsset) {
      return false
    }

    return foundAsset.brand === brandId
  }

  const deleteAsset = async (asset: IBrandAsset) => {
    if (!hasDeleteAccess(asset)) {
      return
    }

    await deleteBrandAsset(asset.brand, asset.id)
    setAllAssets(items => items.filter(item => item.id !== asset.id))
    setAssets(items => items.filter(item => item.id !== asset.id))
  }

  useDeepCompareEffect(() => {
    fetchAssets()
  }, [brandId, options])

  const search = useCallback(
    (query: string) => {
      const searchResult = allAssets.filter(item =>
        item.label.toLowerCase().includes(query.toLowerCase())
      )

      setAssets(searchResult)
    },
    [allAssets]
  )

  return {
    search,
    delete: deleteAsset,
    refetch: fetchAssets,
    hasDeleteAccess,
    assets,
    isLoading
  }
}
