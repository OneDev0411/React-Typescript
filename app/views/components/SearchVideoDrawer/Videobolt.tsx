import { memo, useCallback } from 'react'

import { Box, makeStyles } from '@material-ui/core'
import { useEffectOnce } from 'react-use'

import useAsync from '@app/hooks/use-async'
import LoadingContainer from '@app/views/components/LoadingContainer'

import SearchVideoEmptyState from './SearchVideoEmptyState'
import SearchVideoResults from './SearchVideoResults'
import { SearchVideoResult, Video } from './types'
import useVideoboltVideos from './use-videobolt-videos'

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
  { name: 'Videobolt' }
)

interface VideoboltProps {
  onSelect: (video: Video) => void
}

function Videobolt({ onSelect }: VideoboltProps) {
  const classes = useStyles()
  const {
    data: result,
    isLoading,
    run
  } = useAsync<SearchVideoResult[]>({ data: [] })
  const { getVideos } = useVideoboltVideos()

  const fetchVideos = useCallback(() => {
    run(async () => {
      const videos = await getVideos()

      const results = videos.map<SearchVideoResult>(video => ({
        title: video.listing_id && `Listing #${video.listing_id}`,
        // thumbnail: 'https://images.unsplash.com/photo-1537726235470-8504e3beef77?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
        directLink: video.video_url_branded,
        playerUrl: video.video_landing_page,
        url: video.video_url_branded,
        publisher: video.email,
        publishedAt: video.timestamp || undefined,
        sourceIcon: 'https://videobolt.com/website/images/favicon.jpg',
        source: 'videobolt'
      }))

      return results
    })
  }, [run, getVideos])

  const isLoadingState = isLoading
  const isEmptyState = !isLoadingState && result.length === 0

  useEffectOnce(() => fetchVideos())

  return (
    <>
      <Box flex={1} className={classes.result} py={2} px={3}>
        {isLoadingState ? (
          <LoadingContainer noPaddings />
        ) : isEmptyState ? (
          <SearchVideoEmptyState />
        ) : (
          <SearchVideoResults videos={result} onSelect={onSelect} />
        )}
      </Box>
    </>
  )
}

export default memo(Videobolt)
