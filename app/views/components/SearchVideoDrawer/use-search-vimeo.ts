import { useCallback } from 'react'

import superagent from 'superagent'

import { VimeoVideoResource } from './types'

interface UseSearchVimeo {
  searchVimeo: (term: string) => Promise<VimeoVideoResource[]>
  safeSearchVimeo: (term: string) => Promise<VimeoVideoResource[]>
}

export function useSearchVimeo(): UseSearchVimeo {
  const searchVimeo = useCallback(
    async (term: string): Promise<VimeoVideoResource[]> => {
      if (!term.includes('vimeo.com')) {
        return []
      }

      const videoResponse = await superagent
        .get('https://vimeo.com/api/oembed.json')
        .query({
          url: term
        })

      return [videoResponse.body as VimeoVideoResource]
    },
    []
  )

  const safeSearchVimeo = useCallback(
    async (term: string): Promise<VimeoVideoResource[]> => {
      try {
        return await searchVimeo(term)
      } catch (error) {
        // The promise needs to be resolved anyway because I used "Promise.all()"
        // to wait for all responses, and it will be failed if one of the promises
        // got rejected.
        return []
      }
    },
    [searchVimeo]
  )

  return {
    searchVimeo,
    safeSearchVimeo
  }
}
