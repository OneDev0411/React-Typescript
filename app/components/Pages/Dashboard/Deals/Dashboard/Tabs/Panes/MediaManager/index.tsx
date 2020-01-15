import React from 'react'
import { Box } from '@material-ui/core'

// @ts-ignore
import { uploadMedia } from 'models/media-manager'

import Uploader from './components/MediaUploader'

import Header from './components/Header'
import MediaItem from './components/MediaItem'
import UploadPlaceholderItem from './components/UploadPlaceholderItem'
import BulkActionsMenu from './components/BulkActionsMenu'

import { useStyles } from './styles'
import { MediaManagerAPI } from './context'
import useFetchGallery from './hooks/useFetchGallery'

import {
  addMedia,
  setMediaUploadProgress,
  setMediaAsUploaded,
  setNewlyUploadedMediaFields
} from './context/actions'

export default function MediaManager({ deal }: { deal: IDeal }) {
  const classes = useStyles()

  const { isLoading, state, dispatch } = useFetchGallery(deal.id)

  if (isLoading) {
    return 'loading...'
  }

  const upload = async fileObject => {
    const response = await uploadMedia(
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

    const uploadedFileObject = response.body.references.file

    // I know this is ugly! That's the format of data returned from server!
    const fileKey = Object.keys(uploadedFileObject)[0]
    const { id: file, preview_url: src, name } = uploadedFileObject[fileKey]

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
              <MediaItem key={media.file} media={media} deal={deal} />
            ))}
          </Box>
          {state.filter(media => media.selected).length ? (
            <BulkActionsMenu mediaGallery={state} deal={deal} />
          ) : null}
        </Box>
      </MediaManagerAPI.Provider>
    </Uploader>
  )
}
