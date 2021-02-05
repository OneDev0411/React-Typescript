import React, { useState } from 'react'
import { Button, CircularProgress } from '@material-ui/core'

import OverlayDrawer from 'components/OverlayDrawer'
import Search from 'components/Grid/Search'

// import { getVideoThumbnailUrl } from './helpers'
// import { Video } from './types'
import useStyles from './styles'

interface Props {
  isOpen: boolean
  onClose?: () => void
  onSelect: (modelId: string) => void
}

function MatterportDrawer({ isOpen, onClose = () => {}, onSelect }: Props) {
  const classes = useStyles()
  const [modelId, setModelId] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (value: string) => {
    const input = value.trim()

    if (!input) {
      return
    }

    setIsLoading(true)
    setModelId('')

    try {
      const url = new URL(input)

      const targetModelId = url.searchParams.get('m')

      if (url.host === 'my.matterport.com' && targetModelId) {
        setModelId(targetModelId)
      }
    } catch (e) {
      setIsLoading(false)
    }
  }

  const handleConfirm = () => {
    onSelect(modelId)
    setModelId('')
  }

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  const handleImageError = () => {
    setIsLoading(false)
    setModelId('')
  }

  return (
    <OverlayDrawer
      open={isOpen}
      onClose={() => {
        setModelId('')
        onClose()
      }}
    >
      <OverlayDrawer.Header title="Insert a Matterport block" />
      <OverlayDrawer.Body>
        <Search
          onChange={handleChange}
          placeholder="Paste your Matterport link here https://my.matterport.com/show/?m=xxxxxxxxxxx"
          isSearching={isLoading}
          debounceTime={500}
          className={classes.searchInput}
        />
        {isLoading && (
          <div className={classes.loading}>
            <CircularProgress />
          </div>
        )}
        {modelId && (
          <img
            className={classes.image}
            alt="Model Preview"
            src={`https://my.matterport.com/api/v1/player/models/${modelId}/thumb?width=600&dpr=1&disable=upscale`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
      </OverlayDrawer.Body>
      <OverlayDrawer.Footer rowReverse>
        <Button
          disabled={!modelId}
          color="primary"
          variant="contained"
          onClick={handleConfirm}
        >
          Confirm
        </Button>
      </OverlayDrawer.Footer>
    </OverlayDrawer>
  )
}

export default MatterportDrawer
