import { UseMutationResult } from 'react-query'
import { ResponseError } from 'superagent'

import { useMutation, UseMutationOptions } from '@app/hooks/query'

import { allList, myList } from '../query-keys/campaign'

import { createSuperCampaign } from './create-super-campaign'

export type UseCreateSuperCampaign<
  TVariables extends ISuperCampaignInput | ISuperCampaign = ISuperCampaignInput
> = UseMutationResult<
  ISuperCampaign<'template_instance'>,
  ResponseError,
  TVariables
>

export type UseCreateSuperCampaignOptions<
  TVariables extends ISuperCampaignInput | ISuperCampaign = ISuperCampaignInput
> = Omit<
  UseMutationOptions<
    ISuperCampaign<'template_instance'>,
    ResponseError,
    TVariables
  >,
  'invalidates'
>

function isSuperCampaign(
  data: ISuperCampaignInput | ISuperCampaign
): data is ISuperCampaign {
  return 'type' in data && data.type === 'super_campaign'
}

function getSuperCampaignInput(
  data: ISuperCampaignInput | ISuperCampaign
): ISuperCampaignInput {
  if (isSuperCampaign(data)) {
    const superCampaign = data

    return {
      subject: superCampaign.subject,
      description: superCampaign.description,
      template_instance: superCampaign.template_instance,
      tags: superCampaign.tags ?? undefined,
      eligible_brands: superCampaign.eligible_brands ?? undefined,
      due_at: superCampaign.due_at
    }
  }

  return data
}

export function useCreateSuperCampaign<
  TVariables extends ISuperCampaignInput | ISuperCampaign = ISuperCampaignInput
>(
  options?: UseCreateSuperCampaignOptions<TVariables>
): UseCreateSuperCampaign<TVariables> {
  return useMutation(
    variables => createSuperCampaign(getSuperCampaignInput(variables)),
    {
      ...options,
      // Just invalidate the lists of campaigns because we dont know the list sort logic
      // at this stage so having an optimistic update is not easy
      invalidates: [allList(), myList()]
    }
  )
}
