import { MouseEvent, ImgHTMLAttributes, useState } from 'react'
import { Box, Button, Theme, makeStyles } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

import { DangerButton } from 'components/Button/DangerButton'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      cursor: 'pointer',
      transition: 'all 0.5s',
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      background: theme.palette.grey[100],
      '&:hover': {
        background: theme.palette.grey[300],

        '& $actionsContainer': {
          opacity: 1
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
      opacity: 0,
      transition: theme.transitions.create('opacity')
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
  const [isLoading, setIsLoading] = useState(true)

  const handleEdit = (e: MouseEvent) => {
    if (!onEditClick) {
      return
    }

    e.stopPropagation()
    onEditClick()
  }

  const handleDelete = (e: MouseEvent) => {
    if (!onDeleteClick) {
      return
    }

    e.stopPropagation()
    onDeleteClick()
  }

  return (
    <Box m={1} p={1} className={classes.container} onClick={onClick}>
      <img
        alt={alt}
        src={src}
        {...otherImgProps}
        className={classes.image}
        onLoad={() => setIsLoading(false)}
        style={{
          display: isLoading ? 'none' : 'block'
        }}
      />
      {isLoading && (
        <Skeleton animation="wave" variant="rect" height={200} width="100%" />
      )}
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
