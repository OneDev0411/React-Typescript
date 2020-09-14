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
  isPrepared: boolean

  onClose: () => void
  onPrepareClick: () => Promise<void>
  onDownloadClick: () => void
}

export default function ShareDrawer({
  isOpen,
  user,
  template,
  listing,
  isPrepared,
  onClose,
  onPrepareClick,
  onDownloadClick
}: Props) {
  const classes = useStyles()
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

  const handleDownloadClick = async () => {
    onDownloadClick()
  }

  const getButtonCopy = () => {
    if (isPreparing) {
      return 'Loading'
    }

    if (isPrepared) {
      return 'Download'
    }

    return 'Next'
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
              <Typography variant="h6">Share</Typography>
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
                  disabled={isPreparing}
                  onClick={() => {
                    if (isPrepared) {
                      return handleDownloadClick()
                    }

                    handlePrepareClick()
                  }}
                  startIcon={isPrepared ? <SvgIcon path={mdiDownload} /> : null}
                >
                  {getButtonCopy()}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </Drawer>
  )
}
