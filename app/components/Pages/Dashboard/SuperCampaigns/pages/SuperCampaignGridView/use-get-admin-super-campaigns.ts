import { Dispatch, SetStateAction, useEffect, useRef } from 'react'

import useAsync from '@app/hooks/use-async'
import getAllSuperCampaign, {
  FetchRange
} from '@app/models/super-campaign/get-all-super-campaign'

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
      const newLoadedSuperCampaigns = await getAllSuperCampaign(newRange, order)
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
      const loadedSuperCampaigns = await getAllSuperCampaign(
        initialRange,
        order
      )

      rangeRef.current = initialRange

      return loadedSuperCampaigns
    })
  }, [run, order])

  return { isLoading, superCampaigns, setSuperCampaigns, loadMore }
}
