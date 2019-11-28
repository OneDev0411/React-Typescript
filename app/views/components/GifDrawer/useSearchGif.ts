import React from 'react'

import { tenorApi } from './helpers'
import { GifObject, TenorResponse } from './types'

function useSearchGif() {
  const [results, setResults] = React.useState<GifObject[]>([])
  const [searchFor, setSearch] = React.useState<GifObject[]>([])
  const [isSearching, setIsSearching] = React.useState(false)

  React.useEffect(() => {
    let canceled = false

    async function search() {
      setIsSearching(true)

      const response = await fetch(tenorApi('search', [`q=${searchFor}`]))
      const responseData = (await response.json()) as TenorResponse

      if (!canceled) {
        setResults(responseData.results || [])
        setIsSearching(false)
      }
    }

    if (searchFor) {
      search()
    }

    return () => {
      canceled = true
    }
  }, [searchFor])

  return { results, setSearch, isSearching, searchFor }
}

export default useSearchGif
