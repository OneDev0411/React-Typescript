import { useRef } from 'react'

import { Box, Button, CircularProgress } from '@material-ui/core'
import { mdiHelpCircleOutline } from '@mdi/js'
import { useEffectOnce } from 'react-use'

import { useCreateLeadChannelMutation } from '@app/hooks/lead-channel'
import useNotify from '@app/hooks/use-notify'
import { useReplaceQueryParam } from '@app/hooks/use-query-param'
import { muiIconSizes, SvgIcon } from '@app/views/components/SvgIcons'

import { ADD_LEAD_CHANNEL_QUERY_PARAM_KEY } from './constants'
import { isValidLeadChannelSource } from './helpers/is-valid-lead-channel-source'

interface Props {
  sourceType: LeadChannelSourceType
  activeBrandId?: UUID
  isFetching: boolean
  onCreateChannel: (value: LeadChannelSourceType) => void
}

export function ConnectLeadChannelButton({
  sourceType,
  activeBrandId,
  isFetching,
  onCreateChannel
}: Props) {
  const notify = useNotify()
  const containerRef = useRef<Nullable<HTMLDivElement>>(null)

  const [queryParamLeadChannel, , queryParamDeleteLeadChannel] =
    useReplaceQueryParam<string>(ADD_LEAD_CHANNEL_QUERY_PARAM_KEY)
  const { mutateAsync, isLoading } = useCreateLeadChannelMutation(activeBrandId)

  const handleConnect = async (source: LeadChannelSourceType) => {
    if (!activeBrandId) {
      return
    }

    try {
      await mutateAsync({
        sourceType: source
      })
    } catch (e) {
      notify({
        status: 'error',
        message: 'Something went wrong. Please try again.'
      })
    }
  }

  useEffectOnce(() => {
    if (isValidLeadChannelSource(queryParamLeadChannel)) {
      queryParamDeleteLeadChannel()
      containerRef.current?.scrollIntoView({ behavior: 'smooth' })

      handleConnect(queryParamLeadChannel).then(() => {
        onCreateChannel(queryParamLeadChannel)

        notify({
          status: 'success',
          message: `${queryParamLeadChannel} lead channel was created.`
        })
      })
    }
  })

  return (
    <div ref={containerRef}>
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
          onClick={() => handleConnect(sourceType)}
          startIcon={
            isLoading && <CircularProgress size={20} color="inherit" />
          }
          disabled={isLoading || isFetching}
        >
          Connect {sourceType} account
        </Button>
      </Box>
    </div>
  )
}
