import React, { ImgHTMLAttributes } from 'react'
import { Box, Button, Theme, makeStyles } from '@material-ui/core'

import { DangerButton } from 'components/Button/DangerButton'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      cursor: 'pointer',
      transition: 'all 0.5s',
      position: 'relative',
      background: theme.palette.grey[100],
      '&:hover': {
        background: theme.palette.grey[300],

        '& $actionsContainer': {
          visibility: 'visible'
        }
      }
    },
    image: {
      width: '100%',
      height: 'auto'
    },
    actionsContainer: {
      width: '100%',
      padding: theme.spacing(0, 1),
      position: 'absolute',
      bottom: theme.spacing(2),
      left: 0,
      visibility: 'hidden'
    },
    actionButton: {
      margin: theme.spacing(0, 0.5)
    }
  }),
  {
    name: 'ImageSelectDialogImage'
  }
)

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  onClick: () => void
  onEditClick?: () => void
  onDeleteClick?: () => void
}

export default function ImageThumbnail({
  onClick,
  onEditClick,
  onDeleteClick,
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

  const handleDelete = (e: React.MouseEvent) => {
    if (!onDeleteClick) {
      return
    }

    e.stopPropagation()
    onDeleteClick()
  }

  return (
    <Box m={1} p={1} className={classes.container} onClick={onClick}>
      <img alt={alt} src={src} {...otherImgProps} className={classes.image} />
      <Box
        display="flex"
        flexDirection="row"
        className={classes.actionsContainer}
      >
        {onEditClick && (
          <Button
            size="small"
            variant="contained"
            className={classes.actionButton}
            color="secondary"
            onClick={handleEdit}
          >
            Edit
          </Button>
        )}
        {onDeleteClick && (
          <DangerButton
            size="small"
            variant="contained"
            className={classes.actionButton}
            onClick={handleDelete}
          >
            Delete
          </DangerButton>
        )}
      </Box>
    </Box>
  )
}
