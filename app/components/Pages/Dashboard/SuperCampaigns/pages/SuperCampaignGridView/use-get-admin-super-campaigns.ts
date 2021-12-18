import { Dispatch, SetStateAction, useState } from 'react'

import { useEffectOnce } from 'react-use'

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

export function useGetAdminSuperCampaigns(): UseGetSuperCampaign {
  const [range, setRange] = useState<FetchRange>({
    start: 0,
    limit: numberOfLoadSuperCampaignInRequest
  })
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
        start: range.limit,
        limit: range.limit + numberOfLoadSuperCampaignInRequest
      }
      const newLoadedSuperCampaigns = await getAllSuperCampaign(newRange)
      const newSuperCampaigns = [
        ...(superCampaigns ?? []),
        ...newLoadedSuperCampaigns
      ]

      setRange(newRange)

      return newSuperCampaigns
    })
  }

  useEffectOnce(() => {
    run(async () => getAllSuperCampaign(range))
  })

  return { isLoading, superCampaigns, setSuperCampaigns, loadMore }
}
