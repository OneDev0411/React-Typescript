import { useState, useEffect, useCallback } from 'react'

import { useSelector } from 'react-redux'

import { selectUserEmailImpersonateFirst } from '@app/selectors/user'

import { getVideoboltVideos } from './helpers'
import { SearchVideoResult, VideoboltVideo } from './types'

export default function useVideoboltVideos(): () => SearchVideoResult[] {
  const email = useSelector(selectUserEmailImpersonateFirst)

  const [videos, setVideos] = useState<VideoboltVideo[]>([])

  useEffect(() => {
    async function fetchVideos() {
      if (!email) {
        setVideos([])

        return
      }

      const fetchedVideos = await getVideoboltVideos(email)

      setVideos(fetchedVideos)
    }

    fetchVideos()
  }, [email])

  return useCallback(() => {
    return videos.map<SearchVideoResult>(video => ({
      source: 'videobolt',
      title: video.listing_id && `Listing #${video.listing_id}`,
      playerUrl: video.video_landing_page,
      url: video.video_url_branded,
      publisher: video.email,
      publishedAt: video.timestamp || undefined,
      sourceIcon: 'https://videobolt.com/website/images/favicon.jpg'
    }))
  }, [videos])
}
