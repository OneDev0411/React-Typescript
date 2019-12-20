import React, { useState, useEffect } from 'react'
import { CircularProgress, Button } from '@material-ui/core'

import OverlayDrawer from 'components/OverlayDrawer'
import Search from 'components/Grid/Search'

import { getYoutubeThumbnailUrl } from './helpers'
import { Video } from './types'
import { Thumbnail } from './styled'

interface Props {
  isOpen: boolean
  onClose?: () => void
  onSelect: (video?: Video) => void
}

export default function VideoDrawer({
  isOpen,
  onClose = () => {},
  onSelect
}: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [input, setInput] = useState<string>('')
  const [video, setVideo] = useState<Video | undefined>(undefined)

  useEffect(() => {
    if (!input) {
      setVideo(undefined)

      return
    }

    const thumbnail = getYoutubeThumbnailUrl(input)

    if (!thumbnail) {
      setVideo(undefined)

      return
    }

    const newVideo: Video = {
      url: input,
      thumbnail
    }

    setVideo(newVideo)
  }, [input])

  return (
    <OverlayDrawer
      open={isOpen}
      onClose={() => {
        setInput('')
        setVideo(undefined)
        onClose()
      }}
    >
      <OverlayDrawer.Header title="Insert a Youtube video URL" />
      <OverlayDrawer.Body>
        <Search
          onChange={value => {
            if (!value.trim()) {
              setInput('')

              return
            }

            setInput(value)
          }}
          placeholder="https://www.youtube.com/watch?v=0mm57rH1sTE"
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
      <OverlayDrawer.Footer>
        <Button
          disabled={isLoading || !video}
          color="primary"
          variant="contained"
          onClick={() => {
            onSelect(video)
            setInput('')
            setVideo(undefined)
          }}
        >
          Insert Video
        </Button>
      </OverlayDrawer.Footer>
    </OverlayDrawer>
  )
}
