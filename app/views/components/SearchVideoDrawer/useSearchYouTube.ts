import { useEffect, useState } from 'react'

import useSafeDispatch from '@app/hooks/use-safe-dispatch'
import {
  isGoogleAPIScriptLoaded,
  loadGoogleAPIScript,
  unloadGoogleAPIScript
} from '@app/utils/google-api'
import config from 'config'

import { GoogleApiYouTubeSearchResource } from './types'

interface UseSearchYouTube {
  isYouTubeReady: boolean
  searchYouTube: (term: string) => Promise<GoogleApiYouTubeSearchResource[]>
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

  const searchYouTube = (value: string) => {
    return new Promise<GoogleApiYouTubeSearchResource[]>((resolve, reject) => {
      if (!isReady) {
        resolve([])

        return
      }

      gapi.client.youtube.search
        .list({
          part: ['snippet'],
          type: ['video'],
          maxResults: 15,
          q: value
        })
        .then(response => resolve(response.result.items ?? []), reject)
    })
  }

  return { isYouTubeReady: isReady, searchYouTube }
}
