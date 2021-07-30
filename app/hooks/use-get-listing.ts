import { useEffect, useState } from 'react'

import { useAsync } from 'react-use'

import getListing from '@app/models/listings/listing/get-listing'

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

  useAsync(async () => {
    if (!id) {
      return
    }

    try {
      setStatus('loading')

      const response = await getListing(id)

      setListing(response)

      setStatus('success')
    } catch (error) {
      setStatus('error')
      setError(error.message)
    }
  }, [id])

  return { listing, status, error }
}
