import { useState } from 'react'

import { Button, CircularProgress } from '@material-ui/core'

import useNotify from '@app/hooks/use-notify'

import { useCreateLeadChannelMutation } from './queries/use-create-lead-channel-mutation'
import { useLeadChannels } from './queries/use-lead-channels'

interface Props {
  activeBrandId?: UUID
  isFetching: boolean
}

export function ConnectLeadChannelButton({ activeBrandId, isFetching }: Props) {
  const [isWorking, setIsWorking] = useState(false)
  const notify = useNotify()
  const { data: channels } = useLeadChannels(activeBrandId)
  const { mutateAsync } = useCreateLeadChannelMutation(activeBrandId)

  const handleConnect = async () => {
    if (!activeBrandId) {
      return
    }

    try {
      setIsWorking(true)

      await mutateAsync({
        sourceType: 'Zillow'
      })
    } catch (e) {
      notify({
        status: 'error',
        message: 'Something went wrong. Please try again.'
      })
    } finally {
      setIsWorking(false)
    }
  }

  // currently, we only support Zillow channel. this line should remove when we support more channels
  if (channels?.some(channel => channel.source_type === 'Zillow')) {
    return null
  }

  return (
    <Button
      size="small"
      variant="outlined"
      onClick={handleConnect}
      startIcon={
        isWorking ? <CircularProgress size={20} color="inherit" /> : null
      }
      disabled={isWorking || isFetching}
    >
      Connect Zillow account
    </Button>
  )
}
