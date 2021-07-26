import React from 'react'

import { tenorApi } from './helpers'
import { GifObject, TenorResponse } from './types'

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
