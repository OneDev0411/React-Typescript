import { mdiTrashCanOutline } from '@mdi/js'
import { useDispatch } from 'react-redux'

import useNotify from '@app/hooks/use-notify'
import { confirmation } from '@app/store_actions/confirmation'
import { muiIconSizes, SvgIcon } from '@app/views/components/SvgIcons'
import { DangerButton } from 'components/Button/DangerButton'

import { useDeleteLeadChannelMutation } from './queries/use-delete-lead-channel-mutation'

interface Props {
  channel: LeadChannel
  activeBrandId?: UUID
}

export function DeleteLeadChannelBrandButton({
  channel,
  activeBrandId
}: Props) {
  const { mutateAsync } = useDeleteLeadChannelMutation(channel, activeBrandId)
  const notify = useNotify()
  const dispatch = useDispatch()

  const requestDelete = () => {
    dispatch(
      confirmation({
        message: 'Disconnect Channel',
        description: `Please confirm that you want to disconnect ${channel.source_type} channel.`,
        onConfirm: handleDelete
      })
    )
  }

  const handleDelete = async () => {
    try {
      await mutateAsync({})
    } catch (e) {
      if (e.response.status === 401) {
        notify({
          status: 'error',
          message:
            'This channel was created by someone else. You cannot delete it.'
        })
      }
    }
  }

  return (
    <DangerButton
      size="small"
      variant="outlined"
      startIcon={
        <SvgIcon path={mdiTrashCanOutline} size={muiIconSizes.small} />
      }
      onClick={requestDelete}
    >
      Disconnect
    </DangerButton>
  )
}
