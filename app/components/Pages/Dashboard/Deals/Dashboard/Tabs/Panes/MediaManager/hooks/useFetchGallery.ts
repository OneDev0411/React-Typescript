import { useState } from 'react'
import useEffectOnce from 'react-use/lib/useEffectOnce'
import useThunkReducer from 'react-hook-thunk-reducer'

import { getMediaGallery } from 'models/media-manager'

import { reducer } from '../context/reducers'
import { IMediaGallery } from '../types'
import { setGalleryItems } from '../context/actions'

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
