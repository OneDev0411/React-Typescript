import { useCallback } from 'react'

import { useSelector } from 'react-redux'

import { useBrandAssets } from '@app/hooks/use-brand-assets'
import { selectActiveBrandId } from '@app/selectors/brand'

import { createGalleryVideoObject } from './helpers'
import { SearchVideoResult } from './types'

export default function useGalleryVideos(): () => SearchVideoResult[] {
  const brandId = useSelector(selectActiveBrandId)
  const { assets } = useBrandAssets(brandId)

  return useCallback(() => {
    const videoAssets = assets.filter(asset => asset.file.name.endsWith('.mp4'))

    return videoAssets.map<SearchVideoResult>(createGalleryVideoObject)
  }, [assets])
}
