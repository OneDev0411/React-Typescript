import { useState } from 'react'

import { Box, Grid, Typography, Tabs, Tab, makeStyles } from '@material-ui/core'
import type { Model } from 'backbone'

import useNotify from '@app/hooks/use-notify'
import OverlayDrawer from '@app/views/components/OverlayDrawer'

import LoadingContainer from '../LoadingContainer'

import { getVideoGif, getYouTubeVideoGif } from './helpers'
import OnlineVideos from './OnlineVideos'
import { SearchVideoResult, Video, VideoTab } from './types'
import { useWatermarkPlayIcon } from './use-watermark-play-icon'
import Videobolt from './Videobolt'

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

function SearchVideoDrawer({
  isOpen,
  model,
  onClose,
  onSelect,
  uploadThumbnail
}: SearchVideoDrawerProps) {
  const notify = useNotify()
  const classes = useStyles()
  const { isWatermarking, watermarkPlayIcon } = useWatermarkPlayIcon()
  const [activeTab, setActiveTab] = useState<VideoTab>(VideoTab.Online)
  const [isGeneratingThumbnail, setIsGeneratingThumbnail] =
    useState<boolean>(false)

  const handleCloseDrawer = () => {
    if (isGeneratingThumbnail || isWatermarking) {
      return
    }

    onClose()
  }

  const handleSelectVideo = async (video: SearchVideoResult) => {
    let shouldAddPlayIconWatermark = true

    if (video.source === 'youtube') {
      try {
        setIsGeneratingThumbnail(true)

        const result = await getYouTubeVideoGif(video.url)

        video.thumbnail = result.url
        shouldAddPlayIconWatermark = false
      } catch (err) {
        console.error(err)
        notify({
          status: 'warning',
          message:
            'Failed to generate GIF thumbnail. Falling back to the static thumbnail.'
        })
      } finally {
        setIsGeneratingThumbnail(false)
      }
    }

    if (video.source === 'videobolt') {
      try {
        setIsGeneratingThumbnail(true)

        const result = await getVideoGif(video.url)

        video.thumbnail = result.url
        shouldAddPlayIconWatermark = false
      } catch (err) {
        console.error(err)
        notify({
          status: 'error',
          message: 'Failed to generate thumbnail. Please try again.'
        })
      } finally {
        setIsGeneratingThumbnail(false)
      }
    }

    const videoInfo: Video = {
      url: video.playerUrl,
      thumbnail: video.thumbnail,
      thumbnailWithPlayIcon: shouldAddPlayIconWatermark
        ? await watermarkPlayIcon(video.thumbnail!, uploadThumbnail)
        : video.thumbnail
    }

    onSelect(videoInfo)
    model?.trigger('change:video:info', videoInfo)
  }

  const handleChangeTab = (_event: unknown, newValue: VideoTab) => {
    setActiveTab(newValue)
  }

  const renderGeneratingThumbnail = () => {
    return (
      <Box mt="30%">
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
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

  const renderActiveTab = () => {
    if (activeTab === VideoTab.Online) {
      return <OnlineVideos onSelect={handleSelectVideo} />
    }

    return <Videobolt onSelect={handleSelectVideo} />
  }

  return (
    <OverlayDrawer open={isOpen} onClose={handleCloseDrawer} width="690px">
      <OverlayDrawer.Header title="Insert a video" />
      <OverlayDrawer.Body className={classes.body}>
        {isGeneratingThumbnail ? (
          renderGeneratingThumbnail()
        ) : (
          <>
            <Tabs
              value={activeTab}
              onChange={handleChangeTab}
              variant="fullWidth"
              indicatorColor="primary"
            >
              <Tab label="Online Videos" value={VideoTab.Online} />
              <Tab label="VIDEOBOLT" value={VideoTab.Videobolt} />
            </Tabs>
            {renderActiveTab()}
          </>
        )}
      </OverlayDrawer.Body>
    </OverlayDrawer>
  )
}

export default SearchVideoDrawer
