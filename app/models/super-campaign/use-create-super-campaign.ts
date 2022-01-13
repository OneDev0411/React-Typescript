import { UseMutationResult } from 'react-query'
import { ResponseError } from 'superagent'

import { useMutation, UseMutationOptions } from '@app/hooks/query'

import { createSuperCampaign } from './create-super-campaign'
import { getAll } from './query-keys/campaign'

export type UseCreateSuperCampaign = UseMutationResult<
  ISuperCampaign<'template_instance'>
>

export type UseCreateSuperCampaignOptions = Omit<
  UseMutationOptions<
    ISuperCampaign<'template_instance'>,
    ResponseError,
    ISuperCampaignInput
  >,
  'invalidates'
>

export function useCreateSuperCampaign(
  options?: UseCreateSuperCampaignOptions
): UseCreateSuperCampaign {
  return useMutation(createSuperCampaign, {
    invalidates: [getAll()], // TODO: use optimistic update if possible
    ...options
  })
}
