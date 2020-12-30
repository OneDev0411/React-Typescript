import { useEffect, useState } from 'react'

import getListing from '../../../models/listings/listing/get-listing'

type Status = 'error' | 'loading' | 'success' | 'pending'

export interface UseGetListing {
  error: string
  listing: null | IListing<'proposed_agent'>
  status: Status
}

export function useGetListing(id: UUID): UseGetListing {
  const [listing, setListing] = useState<IListing<'proposed_agent'> | null>(
    null
  )
  const [status, setStatus] = useState<Status>('pending')
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchListing() {
      try {
        setStatus('loading')

        const response = await getListing(id)

        setListing(response)

        setStatus('success')
      } catch (error) {
        setStatus('error')
        setError(error.message)
      }
    }

    fetchListing()
  }, [id])

  return { listing, status, error }
}
