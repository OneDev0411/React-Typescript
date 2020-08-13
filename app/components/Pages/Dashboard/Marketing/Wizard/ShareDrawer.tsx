import React from 'react'
import {
  Drawer,
  Grid,
  Typography,
  IconButton,
  makeStyles,
  Theme
} from '@material-ui/core'
import { mdiDownload } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { closeIcon } from 'components/SvgIcons/icons'
import { Thumbnail } from 'components/MarketingTemplateCard/Thumbnail'

const useStyles = makeStyles((theme: Theme) => ({
  contentContainer: {
    padding: theme.spacing(3)
  }
}))

interface Props {
  isOpen: boolean
  user: IUser
  template: IBrandMarketingTemplate
  listing: IListing

  onClose: () => void
  onDownloadClick: () => void
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
        <Grid container direction="column">
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
          <Grid item>
            <Thumbnail user={user} template={template} listing={listing} />
          </Grid>
          <Grid container item justify="space-between">
            <Grid item>
              <IconButton size="medium" onClick={onDownloadClick}>
                <SvgIcon path={mdiDownload} />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton size="medium" onClick={onDownloadClick}>
                <SvgIcon path={mdiDownload} />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton size="medium" onClick={onDownloadClick}>
                <SvgIcon path={mdiDownload} />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton size="medium" onClick={onDownloadClick}>
                <SvgIcon path={mdiDownload} />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </Drawer>
  )
}
