import { useCallback, useEffect, memo } from 'react'

import { Box, Grid, makeStyles, Typography } from '@material-ui/core'
import unescape from 'lodash/unescape'

import useAsync from '@app/hooks/use-async'
import { SearchInput } from '@app/views/components/GlobalHeaderWithSearch/SearchInput'
import LoadingContainer from '@app/views/components/LoadingContainer'

import { makeVimeoDateStandard } from './helpers'
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
    },
    helpText: {
      display: 'block',
      textAlign: 'right',
      color: theme.palette.grey[400]
    }
  }),
  { name: 'OnlineVideos' }
)

interface OnlineVideosProps {
  onSelect: (video: Video) => void
}

const INITIAL_SEARCH_TERM = 'architectural digest'
const SEARCH_TERM_STORAGE_KEY = 'searchVideoDrawer_initialSearchTerm'

function OnlineVideos({ onSelect }: OnlineVideosProps) {
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
          ...vimeoVideos.map<SearchVideoResult>(video => ({
            thumbnail: video.thumbnail_url,
            title: unescape(video.title),
            playerUrl: `https://vimeo.com/${video.video_id}`,
            url: `https://vimeo.com/${video.video_id}`,
            publisher: video.author_name,
            publishedAt: makeVimeoDateStandard(video.upload_date),
            sourceIcon: 'https://f.vimeocdn.com/images_v6/favicon.ico',
            source: 'vimeo'
          })),
          ...youtubeVideos.map<SearchVideoResult>(video => ({
            thumbnail: video.snippet?.thumbnails?.high?.url ?? '',
            title: unescape(video.snippet?.title ?? ''),
            playerUrl: `https://www.youtube.com/watch?v=${video.id?.videoId}`,
            url: `https://www.youtube.com/watch?v=${video.id?.videoId}`,
            publisher: video.snippet?.channelTitle ?? '',
            publishedAt: video.snippet?.publishedAt ?? '',
            sourceIcon:
              'https://www.youtube.com/s/desktop/8cdd1596/img/favicon_32x32.png',
            source: 'youtube'
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
    if (isYouTubeReady) {
      searchVideos(
        localStorage.getItem(SEARCH_TERM_STORAGE_KEY) || INITIAL_SEARCH_TERM
      )
    }
  }, [isYouTubeReady, searchVideos])

  const handleSearchChange = ({
    target
  }: React.ChangeEvent<HTMLInputElement>) => searchVideos(target.value)

  const isLoadingState = isLoading || !isYouTubeReady
  const isEmptyState = !isLoadingState && result.length === 0

  return (
    <>
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
          <Typography className={classes.helpText} variant="caption">
            Youtube and Vimeo links supported
          </Typography>
        </Box>
      )}
      <Box flex={1} className={classes.result} px={3}>
        {isLoadingState ? (
          <LoadingContainer noPaddings />
        ) : isEmptyState ? (
          <SearchVideoEmptyState />
        ) : (
          <Grid container>
            <SearchVideoResults videos={result} onSelect={onSelect} />
          </Grid>
        )}
      </Box>
    </>
  )
}

export default memo(OnlineVideos)
