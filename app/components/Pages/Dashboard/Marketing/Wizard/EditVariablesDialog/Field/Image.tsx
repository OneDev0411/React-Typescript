import React, { useState, useCallback } from 'react'
import {
  Grid,
  Box,
  Card,
  CardMedia,
  CardActionArea,
  CardActions,
  Tooltip,
  IconButton,
  Typography,
  CircularProgress,
  Theme,
  makeStyles
} from '@material-ui/core'
import { useDropzone } from 'dropzone'
import {
  mdiProgressUpload,
  mdiTrashCanOutline,
  mdiCameraOutline
} from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { UploadableFieldProps } from './types'

const useStyles = makeStyles((theme: Theme) => ({
  loadingProgress: {
    display: 'block',
    margin: theme.spacing(1, 'auto')
  },
  image: {
    maxHeight: '300px'
  },
  imageUploadArea: {
    width: '100%',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.grey[200],
    height: 100,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  }
}))

interface Props extends UploadableFieldProps<'image'> {}

export default function ImageField({ variable, onChange, onUpload }: Props) {
  const classes = useStyles()
  const [isUploading, setIsUploading] = useState<boolean>(false)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) {
        return
      }

      try {
        setIsUploading(true)

        const uploadResult = await onUpload(acceptedFiles[0])

        onChange({
          ...variable,
          value: uploadResult.file.url
        })
      } catch (err) {
        console.error(err)
      } finally {
        setIsUploading(false)
      }
    },
    [onUpload, onChange, variable]
  )

  const { getInputProps, getRootProps, open } = useDropzone({
    onDrop,
    multiple: false,
    accept: 'image/*'
  })

  const handleDelete = () => {
    onChange({
      ...variable,
      value: undefined
    })
  }

  if (!variable.value && !isUploading) {
    return (
      <Grid container item>
        <Box width="100%" py={2}>
          <Typography variant="body2">{variable.label}</Typography>
          <div className={classes.imageUploadArea} {...getRootProps()}>
            <input {...getInputProps()} />
            <SvgIcon path={mdiCameraOutline} />
            <Typography variant="body2">Add Photo</Typography>
          </div>
        </Box>
      </Grid>
    )
  }

  return (
    <Grid container item>
      <Box width="100%" py={2}>
        <Typography variant="body2">{variable.label}</Typography>
        <Card variant="outlined">
          <input {...getInputProps()} />
          <CardActionArea>
            {isUploading ? (
              <CardMedia
                className={classes.loadingProgress}
                component={CircularProgress}
              />
            ) : (
              <CardMedia
                className={classes.image}
                component="img"
                src={variable.value}
              />
            )}
          </CardActionArea>
        </Card>
        <CardActions>
          <Tooltip title="Change Image">
            <div>
              <IconButton disabled={isUploading} size="small" onClick={open}>
                <SvgIcon path={mdiProgressUpload} />
              </IconButton>
            </div>
          </Tooltip>
          {variable.value && (
            <Tooltip title="Delete Image">
              <div>
                <IconButton
                  disabled={isUploading}
                  size="small"
                  onClick={handleDelete}
                >
                  <SvgIcon path={mdiTrashCanOutline} />
                </IconButton>
              </div>
            </Tooltip>
          )}
        </CardActions>
      </Box>
    </Grid>
  )
}
