import { Box, Typography } from '@material-ui/core'

import Select from 'components/Select'

import { showingDurationOptions } from '../../constants'

export interface ShowingDurationProps {
  value: number
  onChange: (value: number) => void
  marginBottom?: number
  width?: string
}

function ShowingDuration({
  value,
  onChange,
  marginBottom,
  width = '50%'
}: ShowingDurationProps) {
  return (
    <Box mb={marginBottom}>
      <Typography variant="h6">Showing Duration</Typography>
      <Box width={width} mt={1.5}>
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
