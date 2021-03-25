import React, { useState } from 'react'
import { Button, makeStyles } from '@material-ui/core'
import { AddPhotoAlternateOutlined } from '@material-ui/icons'

import ImageSelectDialog from 'components/ImageSelectDialog'

import { ImageSelectDialogProps } from 'components/ImageSelectDialog/types'

import CarouselImage from './CarouselImage'

const useStyles = makeStyles(theme => ({
  button: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& svg': { fontSize: theme.spacing(4) }
  },
  label: {
    display: 'flex',
    flexDirection: 'column'
  },
  labelText: {
    fontSize: 12,
    marginTop: theme.spacing(1)
  }
}))

export interface CarouselImageAddButtonProps {
  onImageAdd: (src: string) => void
  onImageUpload?: ImageSelectDialogProps['onUpload']
}

function CarouselImageAddButton({
  onImageAdd,
  onImageUpload
}: CarouselImageAddButtonProps) {
  const classes = useStyles()
  const [open, setOpen] = useState(false)

  const openDialog = () => {
    setOpen(true)
  }

  const closeDialog = () => {
    setOpen(false)
  }

  const handleSelect = (imageUrl: string) => {
    closeDialog()
    onImageAdd(imageUrl)
  }

  return (
    <>
      <CarouselImage>
        <Button
          className={classes.button}
          variant="outlined"
          color="primary"
          onClick={openDialog}
          classes={{ label: classes.label }}
        >
          <AddPhotoAlternateOutlined />
          <div className={classes.labelText}>Add Other Photos</div>
        </Button>
      </CarouselImage>
      {open && (
        <ImageSelectDialog
          onClose={closeDialog}
          onSelect={handleSelect}
          onUpload={onImageUpload}
        />
      )}
    </>
  )
}

export default CarouselImageAddButton