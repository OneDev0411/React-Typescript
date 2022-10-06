import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState
} from 'react'

import { Box, Button, CircularProgress } from '@material-ui/core'
import { mdiHelpCircleOutline } from '@mdi/js'

import { useCreateLeadChannelMutation } from '@app/hooks/lead-channel'
import useNotify from '@app/hooks/use-notify'
import { useReplaceQueryParam } from '@app/hooks/use-query-param'
import { muiIconSizes, SvgIcon } from '@app/views/components/SvgIcons'

import { ADD_LEAD_CHANNEL_QUERY_PARAM_KEY } from './constants'
import { isValidLeadChannelSource } from './helpers'

interface Props {
  sourceType: LeadChannelSourceType
  activeBrandId?: UUID
  isFetching: boolean
  setActiveChannel: Dispatch<SetStateAction<LeadChannelSourceType>>
}

export function ConnectLeadChannelButton({
  sourceType,
  activeBrandId,
  isFetching,
  setActiveChannel
}: Props) {
  const notify = useNotify()
  const [buttonRef, setButtonRef] = useState<Nullable<HTMLButtonElement>>(null)
  const [queryParamLeadChannel, , queryParamDeleteLeadChannel] =
    useReplaceQueryParam<string>(ADD_LEAD_CHANNEL_QUERY_PARAM_KEY)
  const { mutateAsync, isLoading } = useCreateLeadChannelMutation(activeBrandId)

  const handleConnect = useCallback(
    async (to: LeadChannelSourceType) => {
      if (!activeBrandId) {
        return
      }

      try {
        await mutateAsync({
          sourceType: to
        })
      } catch (e) {
        notify({
          status: 'error',
          message: 'Something went wrong. Please try again.'
        })
      }
    },
    [activeBrandId, mutateAsync, notify]
  )

  useEffect(() => {
    if (
      !isFetching &&
      buttonRef &&
      queryParamLeadChannel &&
      isValidLeadChannelSource(queryParamLeadChannel)
    ) {
      // Scroll to the Lead channels view
      buttonRef.scrollIntoView({ behavior: 'smooth' })
      // Connect to the lead channel
      handleConnect(queryParamLeadChannel)
      // Change the tab
      setActiveChannel(queryParamLeadChannel)
      queryParamDeleteLeadChannel()
    }
  }, [
    buttonRef,
    handleConnect,
    isFetching,
    mutateAsync,
    queryParamDeleteLeadChannel,
    queryParamLeadChannel,
    setActiveChannel
  ])

  return (
    <Box display="flex" alignItems="center">
      <Box mr={1}>
        <Button
          size="small"
          href={`https://help.rechat.com/guides/crm/connect-to-${sourceType.toLowerCase()}`}
          target="_blank"
          startIcon={
            <SvgIcon path={mdiHelpCircleOutline} size={muiIconSizes.small} />
          }
        >
          How to connect to {sourceType}
        </Button>
      </Box>

      <Button
        size="small"
        variant="outlined"
        onClick={() => {
          handleConnect(sourceType)
        }}
        ref={ref => {
          setButtonRef(ref)
        }}
        startIcon={
          isLoading ? <CircularProgress size={20} color="inherit" /> : null
        }
        disabled={isLoading || isFetching}
      >
        Connect {sourceType} account
      </Button>
    </Box>
  )
}
