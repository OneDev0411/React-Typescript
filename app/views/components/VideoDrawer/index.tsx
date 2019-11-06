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
  onClose = () => { },
  onSelect
}: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [video, setVideo] = useState<Video | undefined>(undefined)

  useEffect(() => {
    if (!video || !video.url) {
      return
    }

    const thumbnail = getYoutubeThumbnailUrl(video.url)

    if (!thumbnail) {
      setVideo(undefined)

      return
    }

    const newVideo: Video = {
      url: video.url,
      thumbnail: getYoutubeThumbnailUrl(video.url)
    }

    setVideo(newVideo)
  }, [video])

  return (
    <OverlayDrawer
      open={isOpen}
      onClose={() => {
        setVideo(undefined)
        onClose()
      }}
    >
      <OverlayDrawer.Header title="Insert a Youtube video URL" />
      <OverlayDrawer.Body>
        <Search
          onChange={value => {
            if (!value) {
              setVideo(undefined)

              return
            }

            setVideo({ url: value })
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
            setVideo(undefined)
          }}
        >
          Insert Video
        </Button>
      </OverlayDrawer.Footer>
    </OverlayDrawer>
  )
}
