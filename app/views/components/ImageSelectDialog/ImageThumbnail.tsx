import { useState, MouseEvent, ImgHTMLAttributes } from 'react'

import { Box, Button, Theme, makeStyles } from '@material-ui/core'
import cn from 'classnames'
import { useInView } from 'react-intersection-observer'

import { DangerButton } from 'components/Button/DangerButton'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      cursor: 'pointer',
      padding: theme.spacing(1),
      margin: theme.spacing(1),
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
    imageLoading: {
      height: 200
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
    name: 'ImageSelectDialogImageThumbnail'
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
  const { ref, inView } = useInView({ delay: 100 })

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

  const shouldRender = inView || !isLoading

  return (
    <div ref={ref} className={classes.container} onClick={onClick}>
      {shouldRender && (
        <>
          <img
            alt={alt}
            src={src}
            {...otherImgProps}
            onLoad={() => setIsLoading(false)}
            className={cn(classes.image, { [classes.imageLoading]: isLoading })}
          />
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
        </>
      )}
    </div>
  )
}
