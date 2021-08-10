import { useState, useCallback } from 'react'

import {
  Grid,
  Box,
  Typography,
  CircularProgress,
  makeStyles,
  useTheme
} from '@material-ui/core'
import { mdiImageMultipleOutline } from '@mdi/js'
import cn from 'classnames'
import { useDropzone } from 'dropzone'

import ImageSelectDialog from 'components/ImageSelectDialog'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { ImageUploadProps } from '../../types'

const useStyles = makeStyles(
  theme => ({
    wrapper: {
      position: 'relative'
    },
    container: {
      background: theme.palette.grey[50],
      borderRadius: theme.shape.borderRadius,
      padding: theme.spacing(2, 0)
    },
    containerUploading: {
      opacity: 0
    },
    uploadingSpinnerContainer: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    actionableText: {
      cursor: 'pointer',
      color: theme.palette.secondary.main,
      transition: theme.transitions.create('color'),

      '&:hover': {
        color: theme.palette.secondary.dark
      }
    }
  }),
  {
    name: 'HipPocketListingFormImageUpload'
  }
)

export default function HipPocketListingFormImageUpload({
  onImageUpload,
  onImageSelect
}: ImageUploadProps) {
  const classes = useStyles()
  const theme = useTheme()
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [isImageSelectDialogOpen, setIsImageSelectDialogOpen] =
    useState<boolean>(false)

  const openImageSelectDialog = () => {
    setIsImageSelectDialogOpen(true)
  }

  const closeImageSelectDialog = () => {
    setIsImageSelectDialogOpen(false)
  }

  const handleSelectImage = (url: string) => {
    onImageSelect(url)
    closeImageSelectDialog()
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        setIsUploading(true)
        await onImageUpload(acceptedFiles)
      } catch (error) {
        console.error('Error uploading images', error)
      } finally {
        setIsUploading(false)
      }
    },
    [onImageUpload]
  )

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: 'image/*',
    disabled: isUploading,
    noClick: true,
    multiple: true
  })

  const dropzoneRootProps = getRootProps()

  return (
    <>
      {isImageSelectDialogOpen && (
        <ImageSelectDialog
          onClose={closeImageSelectDialog}
          onSelect={handleSelectImage}
        />
      )}
      <Grid
        container
        item
        className={classes.wrapper}
        style={isDragActive ? { background: theme.palette.grey[400] } : {}}
        {...{ ...dropzoneRootProps, css: {} }}
      >
        {isUploading && (
          <Box className={classes.uploadingSpinnerContainer}>
            <CircularProgress />
          </Box>
        )}
        <Grid
          container
          item
          direction="column"
          alignItems="center"
          className={cn(classes.container, {
            [classes.containerUploading]: isUploading
          })}
        >
          <input {...getInputProps()} />

          <Grid item>
            <SvgIcon
              path={mdiImageMultipleOutline}
              color={theme.palette.grey[500]}
            />
          </Grid>
          <Grid item>
            <Typography variant="body2" color="textSecondary">
              Drag listing photos here
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" color="textSecondary">
              <span
                onClick={openImageSelectDialog}
                className={classes.actionableText}
              >
                choose from gallery
              </span>{' '}
              or{' '}
              <span onClick={open} className={classes.actionableText}>
                click to upload
              </span>
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}
