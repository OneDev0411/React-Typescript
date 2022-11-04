import { Box, CircularProgress } from '@material-ui/core'

export function LoadingState() {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="80vh"
    >
      <CircularProgress />
    </Box>
  )
}
