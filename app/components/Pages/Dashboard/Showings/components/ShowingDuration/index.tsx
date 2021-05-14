import { Box, Typography } from '@material-ui/core'

import Select from 'components/Select'

import { showingDurationOptions } from '../../constants'

export interface ShowingDurationProps {
  value: number
  onChange: (value: number) => void
  marginBottom?: number
}

function ShowingDuration({
  value,
  onChange,
  marginBottom
}: ShowingDurationProps) {
  return (
    <Box mb={marginBottom}>
      <Typography variant="h6">Showing Duration</Typography>
      <Box width="50%" mt={1.5}>
        <Select<number>
          options={showingDurationOptions}
          value={value}
          onChange={onChange}
        />
      </Box>
    </Box>
  )
}

export default ShowingDuration
