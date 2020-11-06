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

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { closeIcon } from 'components/SvgIcons/icons'
import { Thumbnail } from 'components/MarketingTemplateCard/Thumbnail'

const useStyles = makeStyles(
  (theme: Theme) => ({
    contentContainer: {
      overflow: 'hidden',
      padding: theme.spacing(3)
    }
  }),
  {
    name: 'MarketingWizardPreviewDrawer'
  }
)

interface Props {
  user: IUser
  template: IBrandMarketingTemplate
  listing: IListing

  onClose: () => void
  onPrepareClick: () => Promise<void>
}

export default function PreviewDrawer({
  user,
  template,
  listing,
  onClose,
  onPrepareClick
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

  const getButtonCopy = () => {
    if (isPreparing) {
      return 'Loading'
    }

    return 'Next'
  }

  return (
    <Drawer
      open
      anchor="bottom"
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
              <Typography variant="h6">Preview</Typography>
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
                  variant="contained"
                  color="primary"
                  disabled={isPreparing}
                  onClick={handlePrepareClick}
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
