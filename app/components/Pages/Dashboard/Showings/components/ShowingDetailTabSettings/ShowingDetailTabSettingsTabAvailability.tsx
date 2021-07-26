import { ReactNode } from 'react'

import { Box, Grid } from '@material-ui/core'

import ShowingAvailabilitiesTimes, {
  ShowingAvailabilitiesTimesProps
} from '../ShowingAvailabilitiesTimes'
import ShowingDuration, { ShowingDurationProps } from '../ShowingDuration'

interface ShowingDetailTabSettingsTabAvailabilityProps
  extends Pick<IShowing, 'duration'> {
  duration: ShowingDurationProps['value']
  onDurationChange: ShowingDurationProps['onChange']
  availabilities: ShowingAvailabilitiesTimesProps['value']
  onAvailabilitiesChange: ShowingAvailabilitiesTimesProps['onChange']
  availabilitiesError: ShowingAvailabilitiesTimesProps['error']
  children: ReactNode
}

function ShowingDetailTabSettingsTabAvailability({
  duration,
  onDurationChange,
  availabilities,
  onAvailabilitiesChange,
  availabilitiesError,
  children
}: ShowingDetailTabSettingsTabAvailabilityProps) {
  return (
    <Box maxWidth={580}>
      <Grid container spacing={0}>
        <Grid item xs={12} sm={12} md={5}>
          <Box mr={2}>
            <ShowingDuration
              value={duration}
              onChange={onDurationChange}
              marginBottom={4}
              width="100%"
            />
          </Box>
        </Grid>
      </Grid>
      <ShowingAvailabilitiesTimes
        showingDuration={duration}
        value={availabilities}
        onChange={onAvailabilitiesChange}
        error={availabilitiesError}
      >
        {children}
      </ShowingAvailabilitiesTimes>
    </Box>
  )
}

export default ShowingDetailTabSettingsTabAvailability
