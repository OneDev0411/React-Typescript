import React from 'react'

import { Button, Box } from '@material-ui/core'

import OverlayDrawer from 'components/OverlayDrawer'

export interface CarouselInfo {
  theme: string
  zoom: number
}

export interface CarouselDrawerProps {
  isOpen: boolean
  onClose?: () => void
  onSelect: (info: CarouselInfo) => void
}

function CarouselDrawer({ isOpen, onClose, onSelect }: CarouselDrawerProps) {
  const handleConfirm = () => {
    console.log('handle confirm')
  }

  const handleClose = () => {
    onClose?.()
  }

  return (
    <OverlayDrawer open={isOpen} onClose={handleClose}>
      <OverlayDrawer.Header title="Manage Carousel" />
      <OverlayDrawer.Body>
        <Box marginTop={3}>
          Carousel Images
          <hr />
          Available Options
        </Box>
      </OverlayDrawer.Body>
      <OverlayDrawer.Footer rowReverse>
        <Button color="primary" variant="outlined" onClick={handleConfirm}>
          Add Image To List
        </Button>
        <Button color="primary" variant="contained" onClick={handleConfirm}>
          Confirm
        </Button>
      </OverlayDrawer.Footer>
    </OverlayDrawer>
  )
}

export default CarouselDrawer
