import { Dispatch, SetStateAction, useEffect, useRef } from 'react'

import { SuperAgentRequest } from 'superagent'

import useAsync from '@app/hooks/use-async'
import { getAllSuperCampaign, FetchRange } from '@app/models/super-campaign'

interface UseGetSuperCampaign {
  isLoading: boolean
  superCampaigns: ISuperCampaign[]
  setSuperCampaigns: Dispatch<SetStateAction<ISuperCampaign[]>>
  loadMore: () => void
}

const numberOfLoadSuperCampaignInRequest: number = 50
const initialRange: FetchRange = {
  start: 0,
  limit: numberOfLoadSuperCampaignInRequest
}

export function useGetAdminSuperCampaigns(
  order: string[]
): UseGetSuperCampaign {
  const rangeRef = useRef<FetchRange>(initialRange)
  const requestRef = useRef<Nullable<SuperAgentRequest>>(null)

  const {
    run,
    data: superCampaigns,
    setData: setSuperCampaigns,
    isLoading
  } = useAsync<ISuperCampaign[]>({
    data: [],
    status: 'pending'
  })

  const loadMore = () => {
    run(async () => {
      const newRange: FetchRange = {
        start: rangeRef.current.limit,
        limit: rangeRef.current.limit + numberOfLoadSuperCampaignInRequest
      }
      const newLoadedSuperCampaigns: ISuperCampaign[] = (
        await getAllSuperCampaign(newRange, order)
      ).body.data
      const newSuperCampaigns = [
        ...(superCampaigns ?? []),
        ...newLoadedSuperCampaigns
      ]

      rangeRef.current = newRange

      return newSuperCampaigns
    })
  }

  useEffect(() => {
    run(async () => {
      try {
        if (requestRef.current) {
          requestRef.current.abort()
          requestRef.current = null
        }

        requestRef.current = getAllSuperCampaign(initialRange, order)

        const loadedSuperCampaigns: ISuperCampaign[] = (
          await requestRef.current
        ).body.data

        requestRef.current = null

        rangeRef.current = initialRange

        return loadedSuperCampaigns
      } catch (_) {
        return []
      }
    })
  }, [run, order])

  return {
    isLoading: isLoading || !!requestRef.current,
    superCampaigns,
    setSuperCampaigns,
    loadMore
  }
}
