import React from 'react'

import { GifObject, TenorResponse } from './types'

function useSearchGif() {
  const [results, setResults] = React.useState<GifObject[]>([])
  const [searchFor, setSearch] = React.useState<GifObject[]>([])
  const [isSearching, setIsSearching] = React.useState(false)

  React.useEffect(() => {
    let cancled = false

    async function search() {
      setIsSearching(true)

      const response = await fetch(
        `https://api.tenor.com/v1/search/?q=${searchFor}&key=614KSDZNOPWC&media_filter=minimal`
      )
      const responseData = (await response.json()) as TenorResponse

      if (!cancled) {
        setResults(responseData.results)
        setIsSearching(false)
      }
    }

    search()

    return () => {
      cancled = true
    }
  }, [searchFor])

  return { results, setSearch, isSearching, searchFor }
}

export default useSearchGif
