import React from 'react'
import { Box } from '@material-ui/core'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'

import { reorderGallery } from 'models/media-manager'

import { IMediaItem, IMediaGallery } from '../../types'

import { useStyles } from '../../styles'
import { getMediaSorts } from '../../context/helpers/selectors'
import { reorderGallery as reorderGalleryAction } from '../../context/actions'

import useMediaManagerContext from '../../hooks/useMediaManagerContext'

import MediaItem from '../MediaItem'
import UploadPlaceholderItem from '../UploadPlaceholderItem'

interface Props {
  medias: IMediaGallery
  deal: IDeal
}

export default function Gallery({ medias, deal }: Props) {
  const classes = useStyles()
  const { dispatch } = useMediaManagerContext()

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

    const reorderRequestObject = getMediaSorts(medias)

    reorderGallery(deal.id, reorderRequestObject)
  }

  return (
    <SortableGallery
      axis="xy"
      medias={medias}
      onSortEnd={onSortEnd}
      useDragHandle
    />
  )
}
