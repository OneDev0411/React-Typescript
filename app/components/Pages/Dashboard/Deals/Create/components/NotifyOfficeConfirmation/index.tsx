import {
  Dialog,
  Typography,
  DialogContent,
  Box,
  Button
} from '@material-ui/core'
import { mdiBellOutline } from '@mdi/js'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function NotifyOfficeConfirmation({ isOpen, onClose }: Props) {
  return (
    <Dialog open={isOpen} fullWidth maxWidth="xs">
      <DialogContent>
        <Box textAlign="center">
          <SvgIcon path={mdiBellOutline} size={muiIconSizes.xlarge} />

          <Box my={2}>
            <Typography variant="subtitle1">
              Should we ask office to review once it’s signed?
            </Typography>
          </Box>
        </Box>

        <Box
          my={4}
          width="100"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Button variant="outlined" onClick={onClose}>
            Don’t Submit for Review
          </Button>

          <Box ml={1}>
            <Button variant="contained" color="primary">
              Submit for Review
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
