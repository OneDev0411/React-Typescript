import { useContext } from 'react'

import { UseMutationResult } from 'react-query'
import { ResponseError } from 'superagent'

import { UseMutationOptions } from '@app/hooks/query'
import { convertDateToTimestamp } from '@app/utils/date-utils'
import ConfirmationModalContext from '@app/views/components/ConfirmationModal/context'

import { useUpdateSuperCampaign } from './use-update-super-campaign'

export type UseSendSuperCampaign = Pick<
  UseMutationResult<
    ISuperCampaign<'template_instance'>,
    ResponseError,
    ISuperCampaign<'template_instance'>
  >,
  'mutate' | 'isLoading'
>

export type UseSendSuperCampaignOptions = Pick<
  UseMutationOptions<
    ISuperCampaign<'template_instance'>,
    ResponseError,
    ISuperCampaign<'template_instance'>
  >,
  'onSuccess' | 'onError'
>

export function useSendSuperCampaign(
  options?: UseSendSuperCampaignOptions
): UseSendSuperCampaign {
  const confirmation = useContext(ConfirmationModalContext)

  const mutation = useUpdateSuperCampaign({
    notify: {
      onSuccess: 'The campaign is scheduled to be sent',
      onError:
        'Something went wrong while sending the campaign. Please try again.'
    },
    onSuccess: (data, variables, context) =>
      options?.onSuccess?.(data, variables.superCampaign, context),
    onError: (error, variables, context) =>
      options?.onError?.(error, variables.superCampaign, context)
  })

  return {
    ...mutation,
    mutate: superCampaign => {
      confirmation.setConfirmationModal({
        message: `Are you sure you want to send "${
          superCampaign.subject || 'Untitled Campaign'
        }" now?`,
        confirmLabel: 'Yes, I am',
        onConfirm: () =>
          mutation.mutate({
            superCampaign,
            inputData: {
              due_at: convertDateToTimestamp(new Date())
            }
          })
      })
    }
  }
}
