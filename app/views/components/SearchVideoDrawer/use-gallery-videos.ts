import { useCallback } from 'react'

import { useSelector } from 'react-redux'

import { useBrandAssets } from '@app/hooks/use-brand-assets'
import { selectActiveBrandId } from '@app/selectors/brand'

import { createGalleryVideoObject } from './helpers'
import { SearchVideoResult } from './types'

interface UseGalleryVideos {
  videos: SearchVideoResult[]
  isLoading: boolean
}

export default function useGalleryVideos(): () => UseGalleryVideos {
  const brandId = useSelector(selectActiveBrandId)
  const { isLoading, assets } = useBrandAssets(brandId)

  return useCallback(() => {
    const videoAssets = assets.filter(asset => asset.file.name.endsWith('.mp4'))

    return {
      isLoading,
      videos: videoAssets.map<SearchVideoResult>(createGalleryVideoObject)
    }
  }, [assets, isLoading])
}
