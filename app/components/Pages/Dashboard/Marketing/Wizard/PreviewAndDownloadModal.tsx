import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Typography,
  IconButton,
  Box,
  Button
} from '@material-ui/core'
import { mdiClose } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { Thumbnail } from 'components/MarketingTemplateCard/Thumbnail'

interface Props {
  user: IUser
  template: IBrandMarketingTemplate
  listing: IListing

  onClose: () => void
  onPrepareClick: () => Promise<void>
}

export default function PreviewAndDownloadModal({
  user,
  template,
  listing,
  onClose,
  onPrepareClick
}: Props) {
  const [isPreparing, setIsPreparing] = useState<boolean>(false)

  const handlePrepareClick = async () => {
    try {
      setIsPreparing(true)
      await onPrepareClick()
    } catch (err) {
      console.error(err)
    } finally {
      setIsPreparing(false)
    }
  }

  const getButtonCopy = () => {
    if (isPreparing) {
      return 'Loading'
    }

    return 'Download'
  }

  return (
    <Dialog fullWidth maxWidth="sm" open onClose={onClose}>
      <DialogTitle disableTypography>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Share</Typography>
          <Grid
            container
            item
            alignItems="center"
            justify="flex-end"
            spacing={2}
          >
            <Grid item>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                disabled={isPreparing}
                onClick={handlePrepareClick}
              >
                {getButtonCopy()}
              </Button>
            </Grid>

            <Grid item>
              <IconButton onClick={onClose}>
                <SvgIcon path={mdiClose} />
              </IconButton>
            </Grid>
          </Grid>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box
          width="100%"
          display="flex"
          justifyContent="center"
          overflow="hidden"
          p={3}
        >
          <Box maxWidth="400px">
            <Thumbnail user={user} template={template} listing={listing} />
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
