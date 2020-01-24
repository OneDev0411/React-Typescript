import React, { useState, useRef, useEffect } from 'react'
import { Box, Button, TextareaAutosize, IconButton } from '@material-ui/core'
import cn from 'classnames'

import { SortableHandle } from 'react-sortable-hoc'

import IconEdit from 'components/SvgIcons/Edit/EditIcon'
import { useIconStyles } from 'views/../styles/use-icon-styles'

import { editMedia } from 'models/media-manager'

import { useStyles } from '../../styles'
import ActionsMenu from './ActionsMenu'
import SelectCheckbox from './SelectCheckbox'
import UploadProgessBar from './UploadProgessBar'
import SortHandle from './SortHandle'

import useMediaManagerContext from '../../hooks/useMediaManagerContext'
import { IMediaItem } from '../../types'
import { setMediaName } from '../../context/actions'

interface Props {
  media: IMediaItem
  deal: IDeal
}

export default function MediaItem({ media, deal }: Props) {
  const classes = useStyles()
  const iconClasses = useIconStyles()
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const { file, src, selected, name, order, isNew, uploadProgress } = media

  const { dispatch } = useMediaManagerContext()

  const [editMode, setEditMode] = useState<boolean>(false)

  useEffect(() => {
    if (editMode && textareaRef && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [editMode, textareaRef])

  const handleOnBlur = () => {
    setTimeout(() => {
      setEditMode(false)
    }, 100)
  }

  const renameMedia = (e: React.MouseEvent<HTMLButtonElement> | null) => {
    e && e.preventDefault()

    if (textareaRef && textareaRef.current) {
      const name = textareaRef.current.value

      editMedia(deal.id, file, name)
      dispatch(setMediaName(file, name))
    }
  }

  const cancelEdit = (e: React.MouseEvent<HTMLButtonElement> | null) => {
    e && e.preventDefault()

    setEditMode(false)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      cancelEdit(null)
    }

    if (e.key === 'Enter') {
      // If user wants a new line he would probably know he
      // should press Shift+Enter right?
      e.preventDefault()
      renameMedia(null)
    }
  }

  const DragHandle = SortableHandle(() => (
    <Box>
      <SortHandle />
    </Box>
  ))

  if (isNew) {
    return (
      <Box
        className={cn(classes.mediaCard, classes.mediaCardUploading)}
        order={order}
      >
        <Box className={classes.mediaThumbnailContainer}>
          <div
            className={classes.mediaThumbnail}
            style={{ backgroundImage: `url(${src})` }}
          />
          <UploadProgessBar value={uploadProgress} />
        </Box>
        <Button className={classes.mediaLabel} fullWidth>
          Uploading...
        </Button>
      </Box>
    )
  }

  return (
    <Box className={cn(classes.mediaCard, { selected })} order={order}>
      <Box className={classes.mediaThumbnailContainer}>
        <div
          className={classes.mediaThumbnail}
          style={{ backgroundImage: `url(${src})` }}
        />
        <DragHandle />
        <SelectCheckbox media={media} />
        <ActionsMenu media={media} deal={deal} />
      </Box>

      {!editMode && (
        <Box className={classes.mediaLabel}>
          <IconButton
            className={classes.editButton}
            onClick={() => setEditMode(true)}
          >
            <IconEdit fillColor="#333" className={iconClasses.small} />
          </IconButton>
          {name}
        </Box>
      )}

      {editMode && (
        <form noValidate autoComplete="off">
          <TextareaAutosize
            defaultValue={name}
            onBlur={handleOnBlur}
            ref={textareaRef}
            onKeyDown={onKeyDown}
            className={classes.editTextArea}
          />
          <Button
            variant="outlined"
            onClick={renameMedia}
            className={classes.lowerCaseButton}
          >
            Save
          </Button>{' '}
          <Button onClick={cancelEdit} className={classes.lowerCaseButton}>
            Cancel
          </Button>
        </form>
      )}
    </Box>
  )
}
