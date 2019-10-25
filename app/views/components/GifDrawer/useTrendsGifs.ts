import React from 'react'

import { GifObject, TenorResponse } from './types'

function useTrendsGifs() {
  const [trends, setTrends] = React.useState<GifObject[]>([])

  React.useEffect(() => {
    let cancled = false

    async function getTrends() {
      const response = await fetch(
        'https://api.tenor.com/v1/trending/?key=614KSDZNOPWC&media_filter=minimal'
      )
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
