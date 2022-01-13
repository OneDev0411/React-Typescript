import { useContext } from 'react'

import { convertDateToTimestamp } from '@app/utils/date-utils'
import ConfirmationModalContext from '@app/views/components/ConfirmationModal/context'

import {
  UseUpdateSuperCampaign,
  UseUpdateSuperCampaignOptions,
  useUpdateSuperCampaign
} from './use-update-super-campaign'

export type UseSendSuperCampaign = UseUpdateSuperCampaign

export type UseSendSuperCampaignOptions = Omit<
  UseUpdateSuperCampaignOptions,
  'notify'
>

export function useSendSuperCampaign(
  superCampaign: ISuperCampaign<'template_instance'>,
  options?: UseSendSuperCampaignOptions
): UseSendSuperCampaign {
  const confirmation = useContext(ConfirmationModalContext)

  const mutation = useUpdateSuperCampaign(superCampaign, {
    ...options,
    notify: {
      onSuccess: 'The campaign was sent',
      onError:
        'Something went wrong while sending the campaign. Please try again.'
    }
  })

  return {
    ...mutation,
    mutate: () => {
      confirmation.setConfirmationModal({
        message: `Are you sure you want to send "${
          superCampaign.subject || 'Untitled Campaign'
        }" now?`,
        confirmLabel: 'Yes, I am',
        onConfirm: () =>
          mutation.mutate({
            due_at: convertDateToTimestamp(new Date())
          })
      })
    }
  }
}
