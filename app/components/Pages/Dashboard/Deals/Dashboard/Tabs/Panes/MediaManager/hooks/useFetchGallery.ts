import React, { useState, useEffect, useReducer } from 'react'
import useEffectOnce from 'react-use/lib/useEffectOnce'

import { getMediaGallery } from 'models/media-manager'

import sampleData from '../data-sample'

import { reducer } from '../context/reducers'
import { IMediaGallery } from '../types'
import { setGalleryItems } from '../context/actions'

const sleep = (ms: number, dev: number = 1) => {
  const msWithDev = (Math.random() * dev + 1) * ms

  console.log('Sleeping', msWithDev / 1000, 'sec')

  return new Promise(resolve => setTimeout(resolve, msWithDev))
}

const fetch = async (id: string): Promise<IMediaGallery> => {
  await sleep(1000)

  return sampleData
}

export default function useFetchData(dealId: string) {
  let initialData: IMediaGallery = []

  const [isLoading, setIsLoading] = useState(false)
  // @ts-ignore
  const [state, dispatch] = useReducer(reducer, initialData)

  useEffectOnce(() => {
    async function fetchGallery() {
      setIsLoading(true)

      const results = await getMediaGallery(dealId)

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
