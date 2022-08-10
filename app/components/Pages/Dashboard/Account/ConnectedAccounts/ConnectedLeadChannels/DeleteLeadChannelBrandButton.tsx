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
  const { mutate } = useDeleteLeadChannelMutation(channel, activeBrandId)

  const handleDelete = () => {
    mutate({})
  }

  return (
    <DangerButton size="small" variant="outlined" onClick={handleDelete}>
      Disconnect
    </DangerButton>
  )
}
