import { useCallback, useEffect, useState } from 'react'

import useSafeDispatch from '@app/hooks/use-safe-dispatch'
import {
  isGoogleAPIScriptLoaded,
  loadGoogleAPIScript,
  unloadGoogleAPIScript
} from '@app/utils/google-api'
import { prependHTTPSIfNeeded } from '@app/utils/url'
import config from 'config'

import { getYouTubeVideoId, youtubeSearch, youtubeVideos } from './helpers'
import { YouTubeVideoResource } from './types'

interface UseSearchYouTube {
  isYouTubeReady: boolean
  searchYouTube: (term: string) => Promise<YouTubeVideoResource[]>
  safeSearchYouTube: (term: string) => Promise<YouTubeVideoResource[]>
}

export function useSearchYouTube(): UseSearchYouTube {
  const [isReady, setIsReady] = useState(() => isGoogleAPIScriptLoaded())

  const safeSetIsReady = useSafeDispatch(setIsReady)

  useEffect(() => {
    if (!isReady) {
      loadGoogleAPIScript(() => {
        // The google script has their own promise type and does not support await so there is
        // no way to prevent this callback hell :(
        gapi.load('client', () => {
          gapi.client.init({ apiKey: config.google.api_key }).then(() => {
            gapi.client.load('youtube', 'v3').then(() => safeSetIsReady(true))
          })
        })
      })
    }

    return () => {
      if (isReady) {
        safeSetIsReady(false)
        unloadGoogleAPIScript()
      }
    }
  }, [safeSetIsReady, isReady])

  const searchYouTube = useCallback<
    (term: string) => Promise<YouTubeVideoResource[]>
  >(
    (term: string) => {
      if (!isReady) {
        return Promise.resolve([])
      }

      const termWithHTTPSPrefix = prependHTTPSIfNeeded(term)

      const videoId = getYouTubeVideoId(termWithHTTPSPrefix)

      if (videoId) {
        return youtubeVideos(videoId)
      }

      return youtubeSearch(term)
    },
    [isReady]
  )

  const safeSearchYouTube = useCallback(
    async (term: string): Promise<YouTubeVideoResource[]> => {
      try {
        return await searchYouTube(term)
      } catch (error) {
        console.error(error)

        // The promise needs to be resolved anyway because I used "Promise.all()"
        // to wait for all responses, and it will be failed if one of the promises
        // got rejected.
        return []
      }
    },
    [searchYouTube]
  )

  return { isYouTubeReady: isReady, searchYouTube, safeSearchYouTube }
}
