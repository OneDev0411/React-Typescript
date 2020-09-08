import React, { useState } from 'react'
import {
  Drawer,
  Grid,
  Typography,
  IconButton,
  Box,
  Button,
  makeStyles,
  Theme
} from '@material-ui/core'
import { mdiDownload } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { closeIcon } from 'components/SvgIcons/icons'
import { Thumbnail } from 'components/MarketingTemplateCard/Thumbnail'

const useStyles = makeStyles((theme: Theme) => ({
  contentContainer: {
    overflow: 'hidden',
    padding: theme.spacing(3)
  }
}))

interface Props {
  isOpen: boolean
  user: IUser
  template: IBrandMarketingTemplate
  listing: IListing

  onClose: () => void
  onDownloadClick: () => Promise<void>
}

export default function ShareDrawer({
  isOpen,
  user,
  template,
  listing,
  onClose,
  onDownloadClick
}: Props) {
  const classes = useStyles()
  const [isDownloading, setIsDownloading] = useState<boolean>(false)

  const handleDownloadClick = async () => {
    try {
      setIsDownloading(true)
      await onDownloadClick()
    } catch (err) {
      console.error(err)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Drawer
      anchor="bottom"
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        square: false
      }}
    >
      <div className={classes.contentContainer}>
        <Grid container>
          <Grid
            container
            item
            spacing={3}
            alignItems="center"
            justify="space-between"
          >
            <Grid item>
              <Typography variant="h6">Share to</Typography>
            </Grid>
            <Grid item>
              <IconButton onClick={onClose}>
                <SvgIcon path={closeIcon} />
              </IconButton>
            </Grid>
          </Grid>
          <Grid container item>
            <Thumbnail user={user} template={template} listing={listing} />
          </Grid>
          <Grid container item justify="space-between">
            <Grid item xs>
              <Box p={2}>
                <Button
                  fullWidth
                  size="medium"
                  variant="contained"
                  color="primary"
                  disabled={isDownloading}
                  onClick={handleDownloadClick}
                  startIcon={<SvgIcon path={mdiDownload} />}
                >
                  Download
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </Drawer>
  )
}
