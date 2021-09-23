import { useCallback, useState, useEffect } from 'react'

import { Button, Box, makeStyles } from '@material-ui/core'
import type { Model } from 'backbone'
import useDebouncedCallback from 'use-debounce/lib/callback'

import useAsync from '@app/hooks/use-async'
import OverlayDrawer from 'components/OverlayDrawer'

import { SearchInput } from '../GlobalHeaderWithSearch'
import LoadingContainer from '../LoadingContainer'

import SearchVideoResults from './SearchVideoResults'
import { SearchVideoResult, VideoInfo } from './types'
import { useSearchYouTube } from './useSearchYouTube'

const useStyles = makeStyles(
  {
    body: {
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      padding: 0
    },
    result: {
      overflowX: 'hidden',
      overflowY: 'auto'
    }
  },
  { name: 'SearchVideoDrawer' }
)

interface SearchVideoDrawerProps {
  isOpen: boolean
  model: Nullable<Model>
  onClose: () => void
  onSelect: (video: VideoInfo) => void
}

const INITIAL_SEARCH_TERM = 'architectural digest'
const SEARCH_TERM_STORAGE_KEY = 'searchVideoDrawer_initialSearchTerm'

function SearchVideoDrawer({
  isOpen,
  model,
  onClose,
  onSelect
}: SearchVideoDrawerProps) {
  const classes = useStyles()
  const [video, setVideo] = useState<Nullable<SearchVideoResult>>(null)
  const {
    data: result,
    isLoading,
    run
  } = useAsync<SearchVideoResult[]>({ data: [] })
  const { isYouTubeReady, searchYouTube } = useSearchYouTube()

  const searchVideos = useCallback(
    (value: string) => {
      const searchTerm = value.trim()

      if (!searchTerm) {
        return
      }

      localStorage.setItem(SEARCH_TERM_STORAGE_KEY, searchTerm)

      run(async () => {
        const videos = await searchYouTube(searchTerm)

        return videos.map<SearchVideoResult>(video => ({
          type: 'youtube',
          thumbnail: video.snippet?.thumbnails?.high?.url ?? '',
          title: video.snippet?.title ?? '',
          url: `https://www.youtube.com/watch?v=${video.id?.videoId}`,
          channelURL: `https://www.youtube.com/channel/${video.id?.channelId}`,
          channelTitle: video.snippet?.channelTitle ?? '',
          publishedAt: video.snippet?.publishedAt ?? ''
        }))
      })
    },
    [run, searchYouTube]
  )

  // Load initial videos using the initial term
  useEffect(() => {
    if (isYouTubeReady) {
      searchVideos(
        localStorage.getItem(SEARCH_TERM_STORAGE_KEY) || INITIAL_SEARCH_TERM
      )
    }
  }, [isYouTubeReady, searchVideos])

  const [debouncedSearchVideos] = useDebouncedCallback(searchVideos, 500)

  const handleSearchChange = ({
    target
  }: React.ChangeEvent<HTMLInputElement>) => debouncedSearchVideos(target.value)

  const handleClick = () => {
    if (!video) {
      return
    }

    const videoInfo: VideoInfo = {
      url: video.url,
      thumbnail: video.thumbnail
    }

    onSelect(videoInfo)
    model?.trigger('change:video:info', videoInfo)
    setVideo(null)
  }

  const handleClose = () => {
    setVideo(null)
    onClose()
  }

  return (
    <OverlayDrawer open={isOpen} onClose={handleClose}>
      <OverlayDrawer.Header title="Search for Youtube videos" />
      <OverlayDrawer.Body className={classes.body}>
        {isYouTubeReady && (
          <Box flex={0} px={3} py={2}>
            <SearchInput
              onChange={handleSearchChange}
              fullWidth
              autoFocus
              isLoading={isLoading}
              placeholder="Search"
            />
          </Box>
        )}
        <Box flex={1} className={classes.result} px={3}>
          {isLoading || !isYouTubeReady ? (
            <LoadingContainer />
          ) : (
            <SearchVideoResults
              videos={result}
              selected={video}
              onSelect={setVideo}
            />
          )}
        </Box>
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

export default SearchVideoDrawer
