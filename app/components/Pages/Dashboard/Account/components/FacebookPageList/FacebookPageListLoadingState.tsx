import { Box } from '@material-ui/core'

import LoadingContainer from '@app/views/components/LoadingContainer'

function FacebookPageListLoadingState() {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="64px"
    >
      <LoadingContainer noPaddings size="4rem" />
    </Box>
  )
}

export default FacebookPageListLoadingState
