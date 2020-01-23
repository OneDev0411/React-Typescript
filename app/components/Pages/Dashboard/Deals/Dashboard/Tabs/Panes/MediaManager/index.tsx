import React from 'react'
import { Box } from '@material-ui/core'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'

import { uploadMedia, reorderGallery } from 'models/media-manager'

import LoadingContainer from 'components/LoadingContainer'

import Uploader from './components/MediaUploader'
import {
  getMediaSorts,
  getUploadedMedia,
  getSelectedMedia
} from './context/helpers/selectors'

import Header from './components/Header'
import MediaItem from './components/MediaItem'
import UploadPlaceholderItem from './components/UploadPlaceholderItem'
import BulkActionsMenu from './components/BulkActionsMenu'

import { useStyles } from './styles'
import { MediaManagerContext } from './context'
import useFetchGallery from './hooks/useFetchGallery'
import { IMediaItem, IMediaGallery } from './types'

import {
  addMedia,
  setMediaUploadProgress,
  setMediaAsUploaded,
  reorderGallery as reorderGalleryAction,
  setNewlyUploadedMediaFields
} from './context/actions'

export default function MediaManager({ deal }: { deal: IDeal }) {
  const classes = useStyles()

  const { isLoading, state, dispatch } = useFetchGallery(deal.id)

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
      dispatch(addMedia(file))
      upload(file)
    })
  }

  const SortableMediaItem = SortableElement(
    ({ media, deal }: { media: IMediaItem; deal: IDeal }) => {
      return <MediaItem media={media} deal={deal} />
    }
  )

  const SortableGallery = SortableContainer(
    ({ medias }: { medias: IMediaGallery }) => (
      <Box display="flex" flexWrap="wrap" className={classes.gallery}>
        <UploadPlaceholderItem />
        {medias.map((media, index) => (
          <SortableMediaItem
            key={media.file}
            index={index}
            media={media}
            deal={deal}
          />
        ))}
      </Box>
    )
  )

  const onSortEnd = ({
    oldIndex,
    newIndex
  }: {
    oldIndex: number
    newIndex: number
  }) => {
    dispatch(reorderGalleryAction(oldIndex, newIndex))

    const reorderRequestObject = getMediaSorts(state)

    reorderGallery(deal.id, reorderRequestObject)
  }

  if (isLoading) {
    return (
      <Box
        className={classes.container}
        border={1}
        bgcolor="#fff"
        borderRadius="4px"
        borderColor="#d4d4d4"
        width={1}
      >
        <LoadingContainer
          style={{
            height: '50vh'
          }}
        />
      </Box>
    )
  }

  return (
    <Uploader onDrop={onDrop} disableClick>
      <MediaManagerContext.Provider value={{ state, dispatch }}>
        <Box
          className={classes.container}
          border={1}
          bgcolor="#fff"
          borderRadius="4px"
          borderColor="#d4d4d4"
          width={1}
        >
          <Header mediasCount={getUploadedMedia(state).length} />
          <SortableGallery
            axis="xy"
            medias={state}
            onSortEnd={onSortEnd}
            useDragHandle
          />
          {getSelectedMedia(state).length > 0 && (
            <BulkActionsMenu mediaGallery={state} deal={deal} />
          )}
        </Box>
      </MediaManagerContext.Provider>
    </Uploader>
  )
}
