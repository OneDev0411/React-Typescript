import { useState, useEffect, useCallback } from 'react'

import { useSelector } from 'react-redux'

import { selectUserEmailImpersonateFirst } from '@app/selectors/user'

import { getVideoboltVideos } from './helpers'
import { SearchVideoResult, VideoboltVideo } from './types'

interface UseVideoboltVideos {
  videos: SearchVideoResult[]
  isLoading: boolean
}

export default function useVideoboltVideos(): () => UseVideoboltVideos {
  const email = useSelector(selectUserEmailImpersonateFirst)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [videos, setVideos] = useState<VideoboltVideo[]>([])

  useEffect(() => {
    async function fetchVideos() {
      setIsLoading(true)

      if (!email) {
        setVideos([])
        setIsLoading(false)

        return
      }

      const fetchedVideos = await getVideoboltVideos(email)

      // Filter out videos that are not in the correct format
      // https://gitlab.com/rechat/web/-/issues/6493#note_947641316
      const validVideos = fetchedVideos.filter(
        video => !!video.video_url_branded
      )

      setVideos(validVideos)
      setIsLoading(false)
    }

    fetchVideos()
  }, [email])

  return useCallback(() => {
    return {
      isLoading,
      videos: videos.map<SearchVideoResult>(video => ({
        source: 'videobolt',
        title: video.listing_id && `Listing #${video.listing_id}`,
        playerUrl: video.video_landing_page,
        url: video.video_url_branded,
        publisher: video.email,
        publishedAt: video.timestamp || undefined,
        sourceIcon: 'https://videobolt.com/website/images/favicon.jpg'
      }))
    }
  }, [videos, isLoading])
}
