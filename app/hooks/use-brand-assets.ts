import { useState, useCallback } from 'react'

import { useDeepCompareEffect } from 'react-use'

import { getBrandAssets } from '@app/models/brand/get-brand-assets'

interface Options {
  templateTypes?: IMarketingTemplateType[]
  medium?: IMarketingTemplateMedium
}

interface UseBrandAssets {
  search: (query: string) => void
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

  useDeepCompareEffect(() => {
    async function fetchAssets() {
      setIsLoading(true)

      const fetchedAssets = await getBrandAssets(brandId, options)

      setAllAssets(fetchedAssets)
      setAssets(fetchedAssets)
      setIsLoading(false)
    }

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
    assets,
    isLoading
  }
}
