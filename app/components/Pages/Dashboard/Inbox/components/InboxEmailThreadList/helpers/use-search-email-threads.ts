import { useRef, useEffect } from 'react'

import { searchEmailThreads } from 'models/email/search-email-threads'
import { defaultEmailThreadSelection } from 'models/email/get-email-threads'

export default function useSearchEmailThreads(searchQuery: string) {
  const nextRef = useRef<any>(undefined)
  const finishedRef = useRef<boolean>(false)

  useEffect(() => {
    nextRef.current = undefined
    finishedRef.current = false
  }, [searchQuery])

  return async (
    selection: typeof defaultEmailThreadSelection[number][]
  ): Promise<{
    emailThreads: IEmailThread<'contacts'>[]
    finished: boolean
  }> => {
    if (finishedRef.current) {
      return {
        emailThreads: [],
        finished: true
      }
    }

    const { emailThreads, next } = await searchEmailThreads({
      selection,
      searchQuery,
      next: nextRef.current
    })

    nextRef.current = next
    console.log('next', next) // TODO: Decide about `finished` here.

    const finished = next === null

    finishedRef.current = finished

    return { emailThreads, finished }
  }
}
