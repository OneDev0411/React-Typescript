import { useState, useReducer } from 'react'
import useEffectOnce from 'react-use/lib/useEffectOnce'

import { getMediaGallery } from 'models/media-manager'

import { reducer } from '../context/reducers'
import { IMediaGallery } from '../types'
import { setGalleryItems } from '../context/actions'

export default function useFetchData(dealId: string) {
  let initialData: IMediaGallery = []

  const [isLoading, setIsLoading] = useState(false)
  // @ts-ignore
  const [state, dispatch] = useReducer(reducer, initialData)

  useEffectOnce(() => {
    async function fetchGallery() {
      setIsLoading(true)

      const results = await getMediaGallery(dealId)

      // @ts-ignore
      dispatch(setGalleryItems(results))
      setIsLoading(false)

      return results
    }
    fetchGallery()
  })

  return {
    isLoading,
    state,
    dispatch
  }
}
