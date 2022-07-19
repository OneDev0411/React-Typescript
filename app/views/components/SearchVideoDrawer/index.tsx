import { useState } from 'react'

import { Box, Grid, Typography, Tabs, Tab, makeStyles } from '@material-ui/core'
import type { Model } from 'backbone'

import useNotify from '@app/hooks/use-notify'
import OverlayDrawer from '@app/views/components/OverlayDrawer'

import LoadingContainer from '../LoadingContainer'

import {
  getVideoGif,
  getYouTubeVideoGif,
  shouldAddPlayIconWatermark
} from './helpers'
import OnlineVideos from './OnlineVideos'
import { SearchVideoResult, Video, VideoTab } from './types'
import useGalleryVideos from './use-gallery-videos'
import useVideoboltVideos from './use-videobolt-videos'
import { useWatermarkPlayIcon } from './use-watermark-play-icon'
import VideoList from './VideoList'

const STATIC_FALLBACK_THUMBNAIL =
  'https://images.unsplash.com/photo-1533658280853-e4a10c25a30d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1626&q=80'

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
  model: Nullable<Model>
  onClose: () => void
  onSelect: (video: Video) => void
  uploadThumbnail: (file: File) => Promise<string>
  shouldSkipVideoGif: boolean
}

function SearchVideoDrawer({
  model,
  onClose,
  onSelect,
  uploadThumbnail,
  shouldSkipVideoGif
}: SearchVideoDrawerProps) {
  const notify = useNotify()
  const classes = useStyles()
  const { isWatermarking, watermarkPlayIcon } = useWatermarkPlayIcon()
  const [activeTab, setActiveTab] = useState<VideoTab>(VideoTab.Online)
  const [isGeneratingThumbnail, setIsGeneratingThumbnail] =
    useState<boolean>(false)

  const getVideoboltVideos = useVideoboltVideos()
  const getGalleryVideos = useGalleryVideos()

  const videoboltVideos = getVideoboltVideos()
  const galleryVideos = getGalleryVideos()

  const handleCloseDrawer = () => {
    if (isGeneratingThumbnail || isWatermarking) {
      return
    }

    onClose()
  }

  const handleSelectVideo = async (video: SearchVideoResult) => {
    setIsGeneratingThumbnail(true)

    if (!shouldSkipVideoGif) {
      if (video.source === 'youtube') {
        try {
          const result = await getYouTubeVideoGif(video.url)

          video.thumbnail = result.url
        } catch (err) {
          console.error(err)
          notify({
            status: 'warning',
            message:
              'Failed to generate GIF thumbnail. Falling back to the static thumbnail.'
          })
        }
      }

      if (video.source === 'videobolt' || video.source === 'gallery') {
        try {
          const result = await getVideoGif(video.url)

          video.thumbnail = result.url
        } catch (err) {
          console.error(err)
          notify({
            status: 'warning',
            message:
              'Failed to generate GIF thumbnail. Falling back to a static thumbnail.'
          })
          video.thumbnail = STATIC_FALLBACK_THUMBNAIL
        }
      }
    }

    const videoInfo: Video = {
      url: video.url,
      thumbnail: video.thumbnail ?? video.url,
      thumbnailWithPlayIcon: shouldAddPlayIconWatermark(video.source)
        ? await watermarkPlayIcon(video.thumbnail!, uploadThumbnail)
        : video.thumbnail ?? video.url,
      source: video.source
    }

    setIsGeneratingThumbnail(false)

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
              Generating thumbnail
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

    return (
      <VideoList
        shouldShowUploader={activeTab === VideoTab.Gallery}
        videos={
          activeTab === VideoTab.Videobolt ? videoboltVideos : galleryVideos
        }
        onSelect={handleSelectVideo}
      />
    )
  }

  return (
    <OverlayDrawer open onClose={handleCloseDrawer} width="690px">
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
              <Tab label="Your Gallery" value={VideoTab.Gallery} />

              {videoboltVideos.length > 0 && (
                <Tab label="Videobolt" value={VideoTab.Videobolt} />
              )}
            </Tabs>
            {renderActiveTab()}
          </>
        )}
      </OverlayDrawer.Body>
    </OverlayDrawer>
  )
}

export default SearchVideoDrawer
