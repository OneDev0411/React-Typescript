import React, { ImgHTMLAttributes } from 'react'
import { Box, Button, Theme, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      cursor: 'pointer',
      transition: 'all 0.5s',
      position: 'relative',
      background: theme.palette.grey[100],
      '&:hover': {
        background: theme.palette.grey[300],

        '& $editButton': {
          visibility: 'visible'
        }
      }
    },
    image: {
      width: '100%',
      height: 'auto'
    },
    editButton: {
      position: 'absolute',
      bottom: theme.spacing(2),
      left: theme.spacing(2),
      visibility: 'hidden'
    }
  }),
  {
    name: 'ImageSelectDialogImage'
  }
)

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  onClick: () => void
  onEditClick?: () => void
}

export default function ImageThumbnail({
  onClick,
  onEditClick,
  alt,
  src,
  ...otherImgProps
}: Props) {
  const classes = useStyles()

  const handleEdit = (e: React.MouseEvent) => {
    if (!onEditClick) {
      return
    }

    e.stopPropagation()
    onEditClick()
  }

  return (
    <Box m={1} p={1} className={classes.container} onClick={onClick}>
      <img alt={alt} src={src} {...otherImgProps} className={classes.image} />
      {onEditClick && (
        <Button
          size="small"
          variant="contained"
          color="secondary"
          onClick={handleEdit}
          className={classes.editButton}
        >
          Edit
        </Button>
      )}
    </Box>
  )
}
