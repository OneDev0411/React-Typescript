import React, { useState } from 'react'
import { Box, Button, CircularProgress } from '@material-ui/core'

import type { Model } from 'backbone'

import OverlayDrawer from 'components/OverlayDrawer'
import Search from 'components/Grid/Search'

import useStyles from './styles'

interface Props {
  isOpen: boolean
  matterport: Model | null
  onClose?: () => void
  onSelect: (modelId: string) => void
}

function MatterportDrawer({
  isOpen,
  onClose = () => {},
  onSelect,
  matterport
}: Props) {
  const classes = useStyles()
  const [modelId, setModelId] = useState('')
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (value: string) => {
    const input = value.trim()

    setError(false)

    if (!input) {
      return
    }

    setIsLoading(true)
    setModelId('')

    try {
      const url = new URL(input)

      const targetModelId = url.searchParams.get('m')

      if (
        input.indexOf('https://my.matterport.com/show/') === 0 &&
        targetModelId
      ) {
        setModelId(targetModelId)
      } else {
        setError(true)
        setIsLoading(false)
      }
    } catch (e) {
      setError(true)
      setIsLoading(false)
    }
  }

  const handleConfirm = () => {
    matterport?.set('modelId', modelId)
    onSelect(modelId)
    setModelId('')
  }

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  const handleImageError = () => {
    setIsLoading(false)
    setModelId('')
    setError(true)
  }

  const handleClose = () => {
    setModelId('')
    onClose()
    setError(false)
  }

  return (
    <OverlayDrawer open={isOpen} onClose={handleClose}>
      <OverlayDrawer.Header title="Insert a Matterport block" />
      <OverlayDrawer.Body>
        <Box my={3}>
          <Search
            onChange={handleChange}
            placeholder="Paste your Matterport link here"
            isSearching={isLoading}
            debounceTime={500}
            errorMessage={
              error && (
                <>
                  Please enter a valid matterport address in format:
                  <br />
                  <b className={classes.bold}>
                    https://my.matterport.com/show/?m=xxxxxxxxxxx
                  </b>
                </>
              )
            }
          />
        </Box>
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
