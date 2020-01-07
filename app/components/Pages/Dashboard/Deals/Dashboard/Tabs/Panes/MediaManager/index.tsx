import React, { useState, useEffect } from 'react'
import { Box, CssBaseline, Container, Typography } from '@material-ui/core'

import Header from './components/Header'
import MediaItem from './components/MediaItem'
import UploadPlaceholderItem from './components/UploadPlaceholderItem'
import BulkActionsMenu from './components/BulkActionsMenu'

import { useStyles } from './styles'
import { IMediaItem } from './types'
import { MediaManagerAPI } from './context'
import sampleData from './data-sample'

interface Props {}

export default function MediaManager(props: Props) {
  const classes = useStyles()

  const [mediaGallery, setMediaGallery] = useState<IMediaItem[]>([])
  useEffect(() => {
    const fetchData = async () => {
      setMediaGallery(sampleData)
    }
    fetchData()
  }, [])

  const toggleMediaSelection = (id: string) => {
    const newState = mediaGallery.map(media => {
      if (media.id === id) {
        let selected = media.selected
        return { ...media, selected: !selected }
      } else {
        return media
      }
    })

    return setMediaGallery(newState)
  }

  const toggleGallerySelection = (selected: boolean) => {
    const newState = mediaGallery.map(media => {
      return { ...media, selected: selected }
    })

    return setMediaGallery(newState)
  }

  const getSelectedItems = () => {
    return mediaGallery.filter(item => item.selected)
  }
  const logId = (id: string) => {
    console.log(id)
  }
  const api = {
    toggleMediaSelection,
    getSelectedItems,
    toggleGallerySelection,
    logId
  }

  return (
        <MediaManagerAPI.Provider value={api}>
          <Box
            className={classes.container}
            border={1}
            bgcolor="#fff"
            borderRadius="4px"
            borderColor="#d4d4d4"
            width={1}
          >
            <Header mediaGallery={mediaGallery} />
            <Box display="flex" flexWrap="wrap" className={classes.gallery}>
              <UploadPlaceholderItem />
              {mediaGallery.map(media => (
                <MediaItem key={media.id} {...media} />
              ))}
            </Box>
            {mediaGallery.filter(media => media.selected).length ? (
              <BulkActionsMenu mediaGallery={mediaGallery} />
            ) : null}
          </Box>
        </MediaManagerAPI.Provider>
  )
}
