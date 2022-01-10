import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  Typography
} from '@material-ui/core'

export function MappingDialog() {
  return (
    <Dialog open maxWidth="sm" fullWidth disableBackdropClick>
      <DialogContent>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="space-between"
          my={4}
        >
          <Box mb={4}>
            <CircularProgress />
          </Box>

          <Typography variant="body1">
            We are trying to automatically Connect Columns Label From CSV to
            Rechat Property
          </Typography>

          <Box my={1}>
            <Typography variant="body1">
              It might take a few seconds to finish
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
