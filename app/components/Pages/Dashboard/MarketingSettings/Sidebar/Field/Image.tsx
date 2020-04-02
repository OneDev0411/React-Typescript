import React from 'react'
import {
  Card,
  CardMedia,
  CardActionArea,
  CardActions,
  IconButton,
  Typography,
  makeStyles,
  createStyles,
  Theme
} from '@material-ui/core'

import { useIconStyles } from 'views/../styles/use-icon-styles'

import IconDeleteOutline from 'components/SvgIcons/DeleteOutline/IconDeleteOutline'
import IconUpload from 'components/SvgIcons/Upload/IconUpload'

import { FieldProps } from './types'

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      wrapper: {},
      image: {
        width: '100%',
        height: 'auto'
      },
      imageUploader: {
        width: '100%',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.grey[200],
        height: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }),
  { name: 'MarketingSettingsImageField' }
)

interface Props extends FieldProps {
  // onImageUpload: (image: File) => Promise<void>
}

export default function Image({ name, value, label, onChange }: Props) {
  const classes = useStyles()
  const iconClasses = useIconStyles()

  const onUploadImageClick = () => console.log('UPLOAD CLICKED')

  const renderImage = () => {
    // return <img className={classes.image} alt={name} src={value} />
    return (
      <Card variant="outlined">
        <CardActionArea>
          <CardMedia component="img" src={value} />
        </CardActionArea>
        <CardActions>
          <IconButton size="small">
            <IconUpload className={iconClasses.small} />
          </IconButton>
          <IconButton size="small">
            <IconDeleteOutline className={iconClasses.small} />
          </IconButton>
        </CardActions>
      </Card>
    )
  }

  const renderImageUploader = () => {
    return (
      <div className={classes.imageUploader} onClick={onUploadImageClick}>
        <Typography variant="subtitle2">Click To Upload</Typography>
      </div>
    )
  }

  return (
    <div className={classes.wrapper}>
      <Typography variant="body2">{label}</Typography>

      {value && renderImage()}
      {!value && renderImageUploader()}
    </div>
  )
}
