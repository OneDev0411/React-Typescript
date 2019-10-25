import React from 'react'

import { GifObject, TenorResponse } from './types'
import { tenorApi } from './helpers'

function useTrendsGifs() {
  const [trends, setTrends] = React.useState<GifObject[]>([])

  React.useEffect(() => {
    let cancled = false

    async function getTrends() {
      const response = await fetch(tenorApi('trending'))
      const responseData = (await response.json()) as TenorResponse

      if (!cancled) {
        setTrends(responseData.results)
      }
    }

    getTrends()

    return () => {
      cancled = true
    }
  }, [])

  return trends
}

export default useTrendsGifs
