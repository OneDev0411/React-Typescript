import { useCallback } from 'react'

import { useSelector } from 'react-redux'

import { useBrandAssets } from '@app/hooks/use-brand-assets'
import { selectActiveBrandId } from '@app/selectors/brand'

import { SearchVideoResult } from './types'

export default function useGalleryVideos(): () => SearchVideoResult[] {
  const brandId = useSelector(selectActiveBrandId)
  const { assets } = useBrandAssets(brandId)

  return useCallback(() => {
    const videoAssets = assets.filter(asset => asset.file.name.endsWith('.mp4'))

    return videoAssets.map<SearchVideoResult>(asset => ({
      source: 'gallery',
      playerUrl: 'https://rechat.com',
      url: asset.file.url,
      title: asset.label || 'No Label',
      publishedAt: new Date(asset.created_at * 1000).toISOString(),
      sourceIcon: '/static/images/favicons/favicon-32x32.png'
    }))
  }, [assets])
}
