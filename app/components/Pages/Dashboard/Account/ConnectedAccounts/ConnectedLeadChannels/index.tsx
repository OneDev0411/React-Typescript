import { useCallback, useMemo, useState } from 'react'

import { Box, Grid, ListItem, Typography } from '@material-ui/core'
import { useSelector } from 'react-redux'

import { useLeadChannels } from '@app/hooks/lead-channel'
import { selectActiveBrandUnsafe } from '@app/selectors/brand'
import { ClipboardCopy } from '@app/views/components/ClipboardCopy'
import { PageTabs, Tab } from '@app/views/components/PageTabs'
import { StatusChip } from '@app/views/components/StatusChip'
import { TextMiddleTruncate } from '@app/views/components/TextMiddleTruncate'

import ConnectedAccountsLayout from '../ConnectedAccountsLayout'

import { ConnectLeadChannelButton } from './ConnectLeadChannelButton'
import { LeadChannels } from './constants'
import { DeleteLeadChannelBrandButton } from './DeleteLeadChannelBrandButton'

interface Props {
  className?: string
}

export function ConnectedLeadChannels({ className }: Props) {
  const activeBrand = useSelector(selectActiveBrandUnsafe)

  const { data: channels, isFetching } = useLeadChannels(activeBrand?.id)
  const [activeChannel, setActiveChannel] = useState<LeadChannelSourceType>(
    LeadChannels[0].source
  )

  const channelsList = useMemo(
    () => channels?.filter(channel => channel.source_type === activeChannel),
    [channels, activeChannel]
  )

  const handleCreateChannel = useCallback(
    (value: LeadChannelSourceType) => setActiveChannel(value),
    []
  )

  return (
    <>
      <ConnectedAccountsLayout
        className={className}
        title="Lead Channels"
        description="Capture leads in Rechat from various sources"
        action={() => null}
      >
        <PageTabs
          defaultValue={activeChannel}
          actions={[
            <ConnectLeadChannelButton
              key={0}
              sourceType={activeChannel}
              activeBrandId={activeBrand?.id}
              isFetching={isFetching}
              onCreateChannel={handleCreateChannel}
            />
          ]}
          tabs={LeadChannels.map(channel => (
            <Tab
              key={channel.source}
              value={channel.source}
              label={
                <span onClick={() => setActiveChannel(channel.source)}>
                  {channel.label}
                </span>
              }
            />
          ))}
        />

        <Box mt={1}>
          {channelsList?.length === 0 && !isFetching && (
            <Box mt={2}>
              <Typography variant="body2" color="textSecondary">
                There is no connected lead channel to {activeChannel}
              </Typography>
            </Box>
          )}

          {channelsList?.map(channel => (
            <ListItem key={channel.id}>
              <Grid container alignItems="center">
                <Grid item xs={3}>
                  <Box display="flex" alignItems="center">
                    <Box mr={1}>
                      <strong>
                        <TextMiddleTruncate
                          text={channel.id}
                          maxLength={18}
                          disableTooltip
                        />
                      </strong>
                    </Box>

                    <Box>
                      <ClipboardCopy text={channel.id} />
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={2}>
                  {channel.capture_number > 0 && (
                    <StatusChip text="Active" status="Active" />
                  )}
                </Grid>

                <Grid item xs={2}>
                  <Box display="flex" alignItems="center">
                    <Typography variant="body2" color="textSecondary">
                      Lead captured: &nbsp;
                    </Typography>
                    <Typography variant="body2">
                      {channel.capture_number}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={2}>
                  <Box display="flex" alignItems="center">
                    <Typography variant="body2" color="textSecondary">
                      Brand: &nbsp;
                    </Typography>
                    <Typography variant="body2">{activeBrand?.name}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={3}>
                  <Box display="flex" justifyContent="flex-end">
                    <Box ml={1}>
                      <DeleteLeadChannelBrandButton
                        channel={channel}
                        activeBrandId={activeBrand?.id}
                      />
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </ListItem>
          ))}
        </Box>
      </ConnectedAccountsLayout>
    </>
  )
}
