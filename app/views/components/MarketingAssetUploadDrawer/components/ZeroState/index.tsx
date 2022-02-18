import { useCallback } from 'react'

import {
  Grid,
  Box,
  Typography,
  Divider,
  makeStyles,
  Button
} from '@material-ui/core'
import {
  mdiFileVideoOutline,
  mdiFileImageOutline,
  mdiFileDocumentOutline
} from '@mdi/js'
import { useDropzone, FileRejection } from 'dropzone'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

const useStyles = makeStyles(
  theme => ({
    wrapper: {
      height: '100%',
      padding: theme.spacing(2, 0)
    },
    container: {
      height: '100%',
      border: `1px dashed ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius
    },
    orText: {
      ...theme.typography.body3,
      textAlign: 'center'
    }
  }),
  {
    name: 'MarketingAssetUploadDrawerZeroState'
  }
)

interface Props {
  onUpload: (files: File[], rejections: FileRejection[]) => Promise<void>
}

export default function ZeroState({ onUpload }: Props) {
  const classes = useStyles()

  const onDrop = useCallback(
    (acceptedFiles: File[], rejections: FileRejection[]) => {
      onUpload(acceptedFiles, rejections)
    },
    [onUpload]
  )

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    multiple: true,
    noClick: true,
    accept: ['image/*', 'video/mp4', 'application/pdf']
  })

  return (
    <div className={classes.wrapper} {...getRootProps()}>
      <input {...getInputProps()} />
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        className={classes.container}
      >
        <Grid
          container
          item
          direction="row"
          justifyContent="center"
          spacing={1}
        >
          <Grid item>
            <SvgIcon path={mdiFileVideoOutline} size={muiIconSizes.xlarge} />
          </Grid>
          <Grid item>
            <SvgIcon path={mdiFileImageOutline} size={muiIconSizes.xlarge} />
          </Grid>
          <Grid item>
            <SvgIcon path={mdiFileDocumentOutline} size={muiIconSizes.xlarge} />
          </Grid>
        </Grid>
        <Grid container item justifyContent="center" spacing={2}>
          <Grid item>
            <Box mt={2}>
              <Typography variant="subtitle1">
                {isDragActive
                  ? 'Drop your files to upload'
                  : 'Drag your files to upload'}
              </Typography>
            </Box>
          </Grid>
          <Grid
            container
            item
            direction="row"
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={2}>
              <Divider />
            </Grid>
            <Grid item xs={1}>
              <Typography
                variant="body2"
                color="textSecondary"
                className={classes.orText}
              >
                OR
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Divider />
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Box mt={2} mb={3}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={open}
            >
              Choose From Files
            </Button>
          </Box>
        </Grid>

        <Grid item>
          <Typography
            component="p"
            variant="caption"
            color="textSecondary"
            align="center"
          >
            supported formats
            <br /> JPG, PNG, PDF, MP4, GIF
          </Typography>
        </Grid>
      </Grid>
    </div>
  )
}
