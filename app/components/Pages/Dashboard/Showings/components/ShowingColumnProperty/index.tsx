import { Box, Typography } from '@material-ui/core'

import { Avatar } from 'components/Avatar'

export interface ShowingColumnPropertyProps {
  image: string
  address: string
}

function ShowingColumnProperty({
  image,
  address,
  ...otherProps
}: ShowingColumnPropertyProps) {
  return (
    <Box display="flex" alignItems="center" mr={1}>
      <Box flexShrink="0" flexGrow="0" mr={2}>
        <Avatar url={image} variant="circular" />
      </Box>
      <Typography noWrap variant="body2">
        {address}
      </Typography>
    </Box>
  )
}

export default ShowingColumnProperty
