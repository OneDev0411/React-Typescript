import React from 'react'
import ImageGallery from 'react-image-gallery'
import Modal from '@material-ui/core/Modal'
import IconButton from '@material-ui/core/IconButton'
import { mdiClose } from '@mdi/js'
import { makeStyles, Theme } from '@material-ui/core'
import 'react-image-gallery/styles/css/image-gallery.css'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

const useStyles = makeStyles(
  (theme: Theme) => ({
    modal: {
      position: 'relative'
    },
    lightbox: {
      '& .image-gallery-content': {
        display: 'flex',
        height: '100vh',
        flexDirection: 'column',
        justifyContent: 'center'
      }
    },
    closeBtn: {
      position: 'absolute',
      top: theme.spacing(2),
      right: theme.spacing(2),
      zIndex: 1
    },
    backdrop: {
      backgroundColor: 'rgba(10, 25, 51, 0.9) !important'
    }
  }),
  { name: 'Lightbox' }
)

interface Props {
  images: string[]
  isOpen: boolean
  selectedImageIndex?: number
  handleClose: () => void
}

export default function Lightbox({
  images,
  handleClose,
  isOpen,
  selectedImageIndex = 0
}: Props) {
  const classes = useStyles()

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      className={classes.modal}
      BackdropProps={{
        className: classes.backdrop
      }}
      aria-labelledby="lightbox-modal"
      aria-describedby="lighbox-image-gallery-modal"
    >
      <div>
        <IconButton onClick={handleClose} className={classes.closeBtn}>
          <SvgIcon path={mdiClose} color="white" size={muiIconSizes.xlarge} />
        </IconButton>
        <ImageGallery
          additionalClass={classes.lightbox}
          startIndex={selectedImageIndex}
          items={images.map(url => ({
            original: url,
            thumbnail: url
          }))}
        />
      </div>
    </Modal>
  )
}
