import React, { useState, useEffect } from 'react'
import { CircularProgress, Button } from '@material-ui/core'

import type { Model } from 'backbone'

import OverlayDrawer from 'components/OverlayDrawer'
import Search from 'components/Grid/Search'

import { getVideoThumbnailUrl } from './helpers'
import { Video } from './types'
import { Thumbnail } from './styled'

interface Props {
  isOpen: boolean
  video: Model | null
  onClose?: () => void
  onSelect: (video?: Video) => void
}

export default function VideoDrawer({
  isOpen,
  onClose = () => {},
  video: model,
  onSelect
}: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [input, setInput] = useState<string>('')
  const [video, setVideo] = useState<Video | undefined>(undefined)

  useEffect(() => {
    if (!input) {
      setVideo(undefined)
    }

    async function fetchThumbnail() {
      const thumbnail = await getVideoThumbnailUrl(input)

      if (!thumbnail) {
        setVideo(undefined)

        return
      }

      const newVideo: Video = {
        url: input,
        thumbnail
      }

      setVideo(newVideo)
    }

    fetchThumbnail()
  }, [input])

  const handleClick = () => {
    onSelect(video)
    model?.trigger('change:video:info', video)
    setInput('')
    setVideo(undefined)
  }

  return (
    <OverlayDrawer
      open={isOpen}
      onClose={() => {
        setInput('')
        setVideo(undefined)
        onClose()
      }}
    >
      <OverlayDrawer.Header title="Insert a Youtube/Vimeo video link" />
      <OverlayDrawer.Body>
        <Search
          onChange={value => {
            if (!value.trim()) {
              setInput('')

              return
            }

            setInput(value)
          }}
          placeholder="Paste your Youtube or Vimeo video link here"
          isSearching={isLoading}
          debounceTime={500}
          style={{
            margin: '1.5rem 0'
          }}
        />
        {isLoading && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <CircularProgress />
          </div>
        )}
        {video && video.thumbnail && (
          <Thumbnail onLoad={() => setIsLoading(false)} src={video.thumbnail} />
        )}
      </OverlayDrawer.Body>
      <OverlayDrawer.Footer rowReverse>
        <Button
          disabled={isLoading || !video}
          color="primary"
          variant="contained"
          onClick={handleClick}
        >
          Insert Video
        </Button>
      </OverlayDrawer.Footer>
    </OverlayDrawer>
  )
}
