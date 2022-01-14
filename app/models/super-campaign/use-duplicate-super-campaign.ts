import {
  useCreateSuperCampaign,
  UseCreateSuperCampaign,
  UseCreateSuperCampaignOptions
} from './use-create-super-campaign'

export type UseDuplicateSuperCampaign = UseCreateSuperCampaign<ISuperCampaign>

export type UseDuplicateSuperCampaignOptions = Omit<
  UseCreateSuperCampaignOptions<ISuperCampaign>,
  'notify'
>

export function useDuplicateSuperCampaign(
  options?: UseDuplicateSuperCampaignOptions
): UseDuplicateSuperCampaign {
  const mutation = useCreateSuperCampaign({
    ...options,
    notify: {
      onSuccess: 'The campaign was duplicated',
      onError:
        'Something went wrong while duplicating the campaign. Please try again.'
    }
  })

  return {
    ...mutation,
    mutate: (superCampaign, options) =>
      mutation.mutate(
        {
          ...superCampaign,
          due_at: null
        },
        options
      ),
    mutateAsync: (superCampaign, options) =>
      mutation.mutateAsync(
        {
          ...superCampaign,
          due_at: null
        },
        options
      )
  }
}
