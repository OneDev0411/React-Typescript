import { useCallback, useEffect, useState } from 'react'

import { Box, Button, Grid, makeStyles, Typography } from '@material-ui/core'
import type { Model } from 'backbone'
import unescape from 'lodash/unescape'

import useAsync from '@app/hooks/use-async'
import OverlayDrawer from 'components/OverlayDrawer'

import { SearchInput } from '../GlobalHeaderWithSearch/SearchInput'
import LoadingContainer from '../LoadingContainer'

import { getYouTubeVideoGif, makeVimeoDateStandard } from './helpers'
import SearchVideoEmptyState from './SearchVideoEmptyState'
import SearchVideoResults from './SearchVideoResults'
import { SearchVideoResult, Video } from './types'
import { useSearchVimeo } from './use-search-vimeo'
import { useSearchYouTube } from './use-search-youtube'
import { useWatermarkPlayIcon } from './use-watermark-play-icon'

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
  { name: 'SearchVideoDrawer' }
)

interface SearchVideoDrawerProps {
  isOpen: boolean
  model: Nullable<Model>
  onClose: () => void
  onSelect: (video: Video) => void
  uploadThumbnail: (file: File) => Promise<string>
}

const INITIAL_SEARCH_TERM = 'architectural digest'
const SEARCH_TERM_STORAGE_KEY = 'searchVideoDrawer_initialSearchTerm'

function SearchVideoDrawer({
  isOpen,
  model,
  onClose,
  onSelect,
  uploadThumbnail
}: SearchVideoDrawerProps) {
  const classes = useStyles()
  const {
    data: result,
    isLoading,
    run
  } = useAsync<SearchVideoResult[]>({ data: [] })
  const [video, setVideo] = useState<Nullable<SearchVideoResult>>(null)
  const { isYouTubeReady, safeSearchYouTube } = useSearchYouTube()
  const { safeSearchVimeo } = useSearchVimeo()
  const [isGeneratingThumbnail, setIsGeneratingThumbnail] =
    useState<boolean>(false)
  const { isWatermarking, watermarkPlayIcon } = useWatermarkPlayIcon()

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
            url: `https://vimeo.com/${video.video_id}`,
            publisher: video.author_name,
            publishedAt: makeVimeoDateStandard(video.upload_date),
            sourceIcon: 'https://f.vimeocdn.com/images_v6/favicon.ico',
            source: 'vimeo'
          })),
          ...youtubeVideos.map<SearchVideoResult>(video => ({
            thumbnail: video.snippet?.thumbnails?.high?.url ?? '',
            title: unescape(video.snippet?.title ?? ''),
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
    if (isYouTubeReady && isOpen) {
      searchVideos(
        localStorage.getItem(SEARCH_TERM_STORAGE_KEY) || INITIAL_SEARCH_TERM
      )
    }
  }, [isYouTubeReady, searchVideos, isOpen])

  const handleSearchChange = ({
    target
  }: React.ChangeEvent<HTMLInputElement>) => searchVideos(target.value)

  const handleConfirm = async () => {
    if (!video) {
      return
    }

    if (video.source === 'youtube') {
      try {
        setIsGeneratingThumbnail(true)

        const result = await getYouTubeVideoGif(video.url)

        video.thumbnail = result.url
      } catch (err) {
        console.error(err)
      } finally {
        setIsGeneratingThumbnail(false)
      }
    }

    const videoThumbnailWithPlayIcon = await watermarkPlayIcon(
      video.thumbnail,
      uploadThumbnail
    )

    const videoInfo: Video = {
      url: video.url,
      thumbnail: video.thumbnail,
      thumbnailWithPlayIcon: videoThumbnailWithPlayIcon
    }

    onSelect(videoInfo)
    model?.trigger('change:video:info', videoInfo)

    setVideo(null)
  }

  const handleClose = () => {
    onClose?.()
    setVideo(null)
  }

  const renderGeneratingThumbnail = () => {
    return (
      <Box mt="30%">
        <Grid direction="column" alignItems="center" justifyContent="center">
          <Grid item>
            <LoadingContainer noPaddings />
          </Grid>
          <Grid item>
            <Typography variant="body1" align="center">
              Generating GIF thumbnail
              <br />
              This may take a few seconds.
            </Typography>
          </Grid>
        </Grid>
      </Box>
    )
  }

  const isLoadingState = isLoading || !isYouTubeReady
  const isEmptyState = !isLoadingState && result.length === 0

  return (
    <OverlayDrawer open={isOpen} onClose={handleClose} width="690px">
      <OverlayDrawer.Header title="Insert a Youtube/Vimeo video" />
      <OverlayDrawer.Body className={classes.body}>
        {isGeneratingThumbnail ? (
          renderGeneratingThumbnail()
        ) : (
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
                <LoadingContainer />
              ) : isEmptyState ? (
                <SearchVideoEmptyState />
              ) : (
                <SearchVideoResults
                  videos={result}
                  selected={video}
                  onSelect={setVideo}
                />
              )}
            </Box>
          </>
        )}
      </OverlayDrawer.Body>
      <OverlayDrawer.Footer rowReverse>
        <Button
          disabled={!video || isGeneratingThumbnail || isWatermarking}
          color="primary"
          variant="contained"
          onClick={handleConfirm}
        >
          Done
        </Button>
      </OverlayDrawer.Footer>
    </OverlayDrawer>
  )
}

export default SearchVideoDrawer
