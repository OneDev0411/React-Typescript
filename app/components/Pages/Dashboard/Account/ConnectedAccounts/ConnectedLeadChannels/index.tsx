import { Box, Grid, Typography } from '@material-ui/core'
import { useSelector } from 'react-redux'

import { selectActiveBrandUnsafe } from '@app/selectors/brand'
import { ClipboardCopy } from '@app/views/components/ClipboardCopy'
import { StatusChip } from '@app/views/components/StatusChip'
import { TextMiddleTruncate } from '@app/views/components/TextMiddleTruncate'

import ConnectedAccountsLayout from '../ConnectedAccountsLayout'

import { ConnectLeadChannelButton } from './ConnectLeadChannelButton'
import { DeleteLeadChannelBrandButton } from './DeleteLeadChannelBrandButton'
import { useLeadChannels } from './queries/use-lead-channels'

interface Props {
  className?: string
}

export function ConnectedLeadChannels({ className }: Props) {
  const activeBrand = useSelector(selectActiveBrandUnsafe)

  const { data: channels, isFetching } = useLeadChannels(activeBrand?.id)

  return (
    <>
      <ConnectedAccountsLayout
        className={className}
        title="Zillow"
        description="Capture Zillow leads in Rechat"
        action={
          <span>
            <ConnectLeadChannelButton
              activeBrandId={activeBrand?.id}
              isFetching={isFetching}
            />
          </span>
        }
      >
        {channels?.map(channel => (
          <Box key={channel.id} mb={2}>
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
          </Box>
        ))}
      </ConnectedAccountsLayout>
    </>
  )
}
