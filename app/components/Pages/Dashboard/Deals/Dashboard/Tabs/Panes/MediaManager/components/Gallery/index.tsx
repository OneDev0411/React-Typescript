import React from 'react'
import { Box } from '@material-ui/core'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'

import type { IMediaItem, IMediaGallery } from '../../types'

import { useStyles } from '../../styles'
import { reorderGallery } from '../../context/actions'

import useMediaManagerContext from '../../hooks/useMediaManagerContext'

import MediaItem from '../MediaItem'
import UploadPlaceholderItem from '../UploadPlaceholderItem'

interface Props {
  medias: IMediaGallery
  deal: IDeal
  uploaderRef: React.RefObject<any>
  sortEnabled: Boolean
}

export default function Gallery({
  medias,
  deal,
  uploaderRef,
  sortEnabled
}: Props) {
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
        <UploadPlaceholderItem uploaderRef={uploaderRef} />
        {medias.map((media, index) => (
          <SortableMediaItem
            key={media.id}
            index={index}
            media={media}
            deal={deal}
            disabled={!sortEnabled}
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
    dispatch(reorderGallery(oldIndex, newIndex, deal.id))
  }

  return (
    <SortableGallery
      axis="xy"
      medias={medias}
      onSortEnd={onSortEnd}
      useDragHandle
      useWindowAsScrollContainer
      lockToContainerEdges
    />
  )
}
