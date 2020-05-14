import { useState } from 'react'

import Fetch from 'services/fetch'

export function useFetch() {
  const [isFetching, setIsFetching] = useState(false)

  const request = async (
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    url: string,
    data: object,
    options = {}
  ) => {
    try {
      setIsFetching(true)

      return new Fetch(options)[method](url)
    } catch (e) {
      throw e
    } finally {
      setIsFetching(false)
    }
  }

  return [request, isFetching]
}
