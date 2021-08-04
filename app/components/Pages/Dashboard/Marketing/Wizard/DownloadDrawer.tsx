import React, { useState } from 'react'

import {
  Drawer,
  Grid,
  Typography,
  IconButton,
  Button,
  Box,
  makeStyles,
  Theme,
  CircularProgress
} from '@material-ui/core'

import { closeIcon } from 'components/SvgIcons/icons'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

const useStyles = makeStyles(
  (theme: Theme) => ({
    contentContainer: {
      overflow: 'hidden',
      padding: theme.spacing(3)
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      maxWidth: '360px', // In order to keep the thumbnail beautiful
      margin: '0 auto'
    }
  }),
  {
    name: 'MarketingWizardDownloadDrawer'
  }
)

interface Props {
  file: IFile
  onShare?: () => void
  onClose: () => void
}

export default function DownloadDrawer({ file, onShare, onClose }: Props) {
  const classes = useStyles()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const handleLoadComplete = () => {
    setIsLoading(false)
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
            justifyContent="space-between"
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
            <img
              src={file.url}
              alt="marketing template"
              className={classes.image}
              hidden={isLoading}
              onLoad={handleLoadComplete}
            />
          </Grid>
          <Grid container item justifyContent="space-between">
            <Grid item xs>
              <Box p={2} textAlign="center">
                {isLoading && <CircularProgress />}
                {!isLoading &&
                  (onShare ? (
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={onShare}
                    >
                      Share
                    </Button>
                  ) : (
                    <Typography variant="body1" align="center">
                      Touch and hold the image above to share or download.
                    </Typography>
                  ))}
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </Drawer>
  )
}
