import React, { useReducer, useEffect } from 'react'
import { Box } from '@material-ui/core'

// @ts-ignore
import Model from 'models/media-manager'

import Uploader from './components/MediaUploader'

import Header from './components/Header'
import MediaItem from './components/MediaItem'
import UploadPlaceholderItem from './components/UploadPlaceholderItem'
import BulkActionsMenu from './components/BulkActionsMenu'

import { useStyles } from './styles'
import { MediaManagerAPI } from './context'
import { reducer, initialState } from './context/reducers'
import sampleData from './data-sample'
import {
  addMedia,
  setGalleryItems,
  setMediaUploadProgress,
  setMediaAsUploaded,
  setNewlyUploadedMediaFields
} from './context/actions'

interface Props {
  deal: IDeal
}

export default function MediaManager({ deal }: Props) {
  const classes = useStyles()

  const [state, dispatch] = useReducer(reducer, initialState)

  const upload = async fileObject => {
    const response = await Model.uploadFile(
      deal.id,
      fileObject,
      '',
      progressEvent => {
        if (progressEvent.percent) {
          dispatch(
            setMediaUploadProgress(fileObject.name, progressEvent.percent)
          )
        } else {
          dispatch(setMediaAsUploaded(fileObject.name))
        }
      }
    )

    const { id: file, preview_url: src, name } = response.body.data

    dispatch(setNewlyUploadedMediaFields(fileObject.name, file, src, name))
  }

  const onDrop = (files: any[], rejectedFiles: []) => {
    // TODO: Do something with rejected files. Show some alert maybe?
    files.forEach(file => {
      let fileId = file.name ? file.name : ''

      dispatch(addMedia(file))
      upload(file)
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setGalleryItems(sampleData))
    }

    fetchData()
  }, [])

  return (
    <Uploader onDrop={onDrop} disableClick>
      <MediaManagerAPI.Provider value={{ state, dispatch }}>
        <Box
          className={classes.container}
          border={1}
          bgcolor="#fff"
          borderRadius="4px"
          borderColor="#d4d4d4"
          width={1}
        >
          <Header mediaGallery={state} />
          <Box display="flex" flexWrap="wrap" className={classes.gallery}>
            <UploadPlaceholderItem />
            {state.map(media => (
              <MediaItem key={media.file} {...media} />
            ))}
          </Box>
          {state.filter(media => media.selected).length ? (
            <BulkActionsMenu mediaGallery={state} />
          ) : null}
        </Box>
      </MediaManagerAPI.Provider>
    </Uploader>
  )
}
