import { useCallback, useEffect } from 'react'

import { Box, makeStyles } from '@material-ui/core'
import type { Model } from 'backbone'
import unescape from 'lodash/unescape'

import useAsync from '@app/hooks/use-async'
import OverlayDrawer from 'components/OverlayDrawer'

import { SearchInput } from '../GlobalHeaderWithSearch'
import LoadingContainer from '../LoadingContainer'

import SearchVideoEmptyState from './SearchVideoEmptyState'
import SearchVideoResults from './SearchVideoResults'
import { SearchVideoResult, Video } from './types'
import { useSearchVimeo } from './use-search-vimeo'
import { useSearchYouTube } from './use-search-youtube'

const useStyles = makeStyles(
  theme => ({
    body: {
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      padding: theme.spacing(0, 0, 2, 0)
    },
    result: {
      overflowX: 'hidden',
      overflowY: 'auto'
    }
  }),
  { name: 'SearchVideoDrawer' }
)

interface SearchVideoDrawerProps {
  isOpen: boolean
  model: Nullable<Model>
  onClose: () => void
  onSelect: (video: Video) => void
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
  const {
    data: result,
    isLoading,
    run
  } = useAsync<SearchVideoResult[]>({ data: [] })
  const { isYouTubeReady, safeSearchYouTube } = useSearchYouTube()
  const { safeSearchVimeo } = useSearchVimeo()

  const searchVideos = useCallback(
    (value: string) => {
      const searchTerm = value.trim()

      if (!searchTerm) {
        return
      }

      run(async () => {
        // Send both request at the same time and wait for the results
        const [youtubeVideos, vimeoVideos] = await Promise.all([
          safeSearchYouTube(searchTerm),
          safeSearchVimeo(searchTerm)
        ])

        const results = [
          ...youtubeVideos.map<SearchVideoResult>(video => ({
            thumbnail: video.snippet?.thumbnails?.high?.url ?? '',
            title: unescape(video.snippet?.title ?? ''),
            url: `https://www.youtube.com/watch?v=${video.id?.videoId}`,
            publisher: video.snippet?.channelTitle ?? '',
            publishedAt: video.snippet?.publishedAt ?? ''
          })),
          ...vimeoVideos.map<SearchVideoResult>(video => ({
            thumbnail: video.thumbnail_url,
            title: unescape(video.title),
            url: `https://vimeo.com/${video.video_id}`,
            publisher: video.author_name,
            publishedAt: video.upload_date
          }))
        ]

        // Update the search term if there is any result
        if (results.length > 0) {
          localStorage.setItem(SEARCH_TERM_STORAGE_KEY, searchTerm)
        }

        return results
      })
    },
    [run, safeSearchYouTube, safeSearchVimeo]
  )

  // Load initial videos using the initial term
  useEffect(() => {
    if (isYouTubeReady && isOpen) {
      searchVideos(
        localStorage.getItem(SEARCH_TERM_STORAGE_KEY) || INITIAL_SEARCH_TERM
      )
    }
  }, [isYouTubeReady, searchVideos, isOpen])

  const handleSearchChange = ({
    target
  }: React.ChangeEvent<HTMLInputElement>) => searchVideos(target.value)

  const handleSelect = (video: SearchVideoResult) => {
    const videoInfo: Video = {
      url: video.url,
      thumbnail: video.thumbnail
    }

    onSelect(videoInfo)
    model?.trigger('change:video:info', videoInfo)
  }

  const isLoadingState = isLoading || !isYouTubeReady
  const isEmptyState = !isLoadingState && result.length === 0

  return (
    <OverlayDrawer open={isOpen} onClose={onClose}>
      <OverlayDrawer.Header title="Insert a Youtube/Vimeo video" />
      <OverlayDrawer.Body className={classes.body}>
        {isYouTubeReady && (
          <Box flex={0} px={3} py={2}>
            <SearchInput
              onChange={handleSearchChange}
              fullWidth
              autoFocus
              isLoading={isLoading}
              placeholder="Search"
              debounceTime={500}
            />
          </Box>
        )}
        <Box flex={1} className={classes.result} px={3}>
          {isLoadingState ? (
            <LoadingContainer />
          ) : isEmptyState ? (
            <SearchVideoEmptyState />
          ) : (
            <SearchVideoResults videos={result} onSelect={handleSelect} />
          )}
        </Box>
      </OverlayDrawer.Body>
    </OverlayDrawer>
  )
}

export default SearchVideoDrawer
