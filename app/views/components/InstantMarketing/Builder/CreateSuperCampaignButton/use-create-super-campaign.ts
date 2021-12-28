import useAsync from '@app/hooks/use-async'
import createSuperCampaignModel from '@app/models/super-campaign/create-super-campaign'

interface UseCreateSuperCampaign {
  isCreatingSuperCampaign: boolean
  createSuperCampaign: (data: ISuperCampaignInput) => Promise<ISuperCampaign>
}

export function useCreateSuperCampaign(): UseCreateSuperCampaign {
  const { isLoading, run } = useAsync<ISuperCampaign>()

  const createSuperCampaign = (data: ISuperCampaignInput) =>
    run(async () => createSuperCampaignModel(data))

  return { isCreatingSuperCampaign: isLoading, createSuperCampaign }
}
