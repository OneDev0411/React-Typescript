import { useCallback } from 'react'

import { useSelector } from 'react-redux'

import { selectUserEmailImpersonateFirst } from '@app/selectors/user'

import { getVideoboltVideos } from './helpers'
import { VideoboltVideo } from './types'

interface UseVideoboltVideos {
  getVideos: () => Promise<VideoboltVideo[]>
}

export default function useVideoboltVideos(): UseVideoboltVideos {
  const email = useSelector(selectUserEmailImpersonateFirst)
  const getVideos = useCallback(async () => {
    if (!email) {
      return []
    }

    const videos = await getVideoboltVideos(email)

    return videos
  }, [email])

  return {
    getVideos
  }
}
