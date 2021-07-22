import { useState } from 'react'

import useThunkReducer from 'react-hook-thunk-reducer'
import useEffectOnce from 'react-use/lib/useEffectOnce'

import { getMediaGallery } from 'models/Deal/media-manager'

import { setGalleryItems } from '../context/actions'
import { reducer } from '../context/reducers'
import type { IMediaGallery } from '../types'

export default function useFetchData(dealId: string) {
  let initialData: IMediaGallery = []

  const [isLoading, setIsLoading] = useState(false)

  // Instead of using `useReducer` which doesn't support thunks
  const [state, dispatch] = useThunkReducer(reducer, initialData)

  useEffectOnce(() => {
    async function fetchGallery() {
      setIsLoading(true)

      const results = await getMediaGallery(dealId)

      dispatch(setGalleryItems(results))
      setIsLoading(false)
    }
    fetchGallery()
  })

  return {
    isLoading,
    state,
    dispatch
  }
}
