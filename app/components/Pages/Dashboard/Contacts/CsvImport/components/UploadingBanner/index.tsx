import { Box, CircularProgress, Typography } from '@material-ui/core'

export function UploadingBanner() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="50vh"
    >
      <CircularProgress />
      <Box mt={4}>
        <Typography variant="body1">
          Contacts are being uploaded. The process may take up to one minute
          depending on the number of contacts
        </Typography>
      </Box>
    </Box>
  )
}
