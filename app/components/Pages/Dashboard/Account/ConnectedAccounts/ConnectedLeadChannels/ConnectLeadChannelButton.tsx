import { useState } from 'react'

import { Button, CircularProgress } from '@material-ui/core'

import useNotify from '@app/hooks/use-notify'

import { useCreateLeadChannelMutation } from './queries/use-create-lead-channel-mutation'

interface Props {
  activeBrandId?: UUID
  isFetching: boolean
}

export function ConnectLeadChannelButton({ activeBrandId, isFetching }: Props) {
  const [isWorking, setIsWorking] = useState(false)
  const notify = useNotify()

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
