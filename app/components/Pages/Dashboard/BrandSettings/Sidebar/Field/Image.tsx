import React, { useState, useCallback } from 'react'
import {
  Card,
  CardMedia,
  CardActionArea,
  CardActions,
  CircularProgress,
  Tooltip,
  IconButton,
  Typography,
  makeStyles,
  Theme
} from '@material-ui/core'
import { useDropzone } from 'dropzone'
import { mdiProgressUpload, mdiTrashCanOutline } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { ImageUploadHandler } from '../../types'
import { FieldProps } from './types'

const useStyles = makeStyles(
  (theme: Theme) => ({
    loadingProgress: {
      display: 'block',
      margin: `${theme.spacing(3)}px auto ${theme.spacing(1)}px`
    },
    image: {
      backgroundColor: theme.palette.grey[400]
    },
    imageUploader: {
      width: '100%',
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.grey[200],
      height: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer'
    }
  }),
  { name: 'MarketingSettingsImageField' }
)

interface Props extends FieldProps {
  onImageUpload: ImageUploadHandler
}

export default function ImageField({
  names,
  value,
  label,
  onImageUpload,
  onChange
}: Props) {
  const classes = useStyles()
  const [isUploading, setIsUploading] = useState<boolean>(false)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) {
        return
      }

      setIsUploading(true)

      const file = await onImageUpload(acceptedFiles[0])

      onChange(names, file.url)

      setIsUploading(false)
    },
    [names, onChange, onImageUpload]
  )

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    multiple: false,
    accept: 'image/*',
    disabled: isUploading
  })

  const handleDeleteClick = () => {
    onChange(names, '')
  }

  const renderImage = () => {
    return (
      <Card variant="outlined">
        <input {...getInputProps()} />
        <CardActionArea>
          {isUploading ? (
            <CardMedia
              className={classes.loadingProgress}
              component={CircularProgress}
            />
          ) : (
            <CardMedia className={classes.image} component="img" src={value} />
          )}
        </CardActionArea>
        <CardActions>
          <Tooltip title="Change Image">
            <div>
              <IconButton disabled={isUploading} size="small" onClick={open}>
                <SvgIcon path={mdiProgressUpload} />
              </IconButton>
            </div>
          </Tooltip>
          <Tooltip title="Delete Image">
            <div>
              <IconButton
                disabled={isUploading}
                size="small"
                onClick={handleDeleteClick}
              >
                <SvgIcon path={mdiTrashCanOutline} />
              </IconButton>
            </div>
          </Tooltip>
        </CardActions>
      </Card>
    )
  }

  const renderImageUploader = () => {
    return (
      <div className={classes.imageUploader} {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <Typography variant="body2">Drop the image here...</Typography>
        ) : (
          <Typography variant="body2">Click or drag an image here</Typography>
        )}
      </div>
    )
  }

  return (
    <div>
      <Typography variant="body2">{label}</Typography>

      {(isUploading || value) && renderImage()}
      {!isUploading && !value && renderImageUploader()}
    </div>
  )
}
