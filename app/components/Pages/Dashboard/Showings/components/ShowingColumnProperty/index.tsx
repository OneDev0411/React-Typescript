import { Box, Typography } from '@material-ui/core'

import { Avatar } from 'components/Avatar'

import useShowingImage from '../../hooks/use-showing-image'
import useShowingAddress, {
  UseShowingAddressProps
} from '../../hooks/use-showing-address'

export type ShowingColumnPropertyProps = UseShowingAddressProps

function ShowingColumnProperty(props: ShowingColumnPropertyProps) {
  return (
    <Box display="flex" alignItems="center" mr={1}>
      <Box flexShrink="0" flexGrow="0" mr={2}>
        <Avatar url={useShowingImage(props)} variant="circular" />
      </Box>
      <Typography noWrap variant="body2">
        {useShowingAddress(props)}
      </Typography>
    </Box>
  )
}

export default ShowingColumnProperty
