import React, { useState, useRef, useEffect } from 'react'
import {
  Box,
  Button,
  TextareaAutosize,
  Typography,
  IconButton
} from '@material-ui/core'
import cn from 'classnames'
import ClickOutside from 'react-click-outside'

import { SortableHandle } from 'react-sortable-hoc'
import { useDispatch } from 'react-redux'
import { addNotification } from 'components/notification'
import { mdiPencilOutline } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { useStyles } from '../../styles'
import ActionsMenu from './ActionsMenu'
import SelectCheckbox from './SelectCheckbox'
import UploadProgessBar from './UploadProgessBar'
import SortHandle from './SortHandle'

import useMediaManagerContext from '../../hooks/useMediaManagerContext'
import type { IMediaItem } from '../../types'
import { renameMedia } from '../../context/actions'

const EMPTY_NAME_TEXT = 'Caption can go here ...'

interface Props {
  media: IMediaItem
  deal: IDeal
}

export default function MediaItem({ media, deal }: Props) {
  const classes = useStyles()
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const reduxDispatch = useDispatch()

  const { id, src, selected, name, order, isUploading, uploadProgress } = media

  const { dispatch } = useMediaManagerContext()

  const [editMode, setEditMode] = useState<boolean>(false)

  useEffect(() => {
    if (editMode && textareaRef && textareaRef.current) {
      let textarea = textareaRef.current

      textarea.focus()
      // put cursor at the end of string
      textarea.setSelectionRange(textarea.value.length, textarea.value.length)
    }
  }, [editMode, textareaRef])

  const handleOnClickOutsideEdit = () => {
    setEditMode(false)
  }

  const saveEdit = (e: React.MouseEvent<HTMLButtonElement> | null) => {
    e && e.preventDefault()

    if (textareaRef && textareaRef.current) {
      const newName = textareaRef.current.value

      try {
        dispatch(renameMedia(id, newName, deal.id))
        setEditMode(false)
      } catch (e) {
        setEditMode(false)
        reduxDispatch(
          addNotification({
            status: 'error',
            message: e.message
          })
        )
      }
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
      saveEdit(null)
    }
  }

  const DragHandle = SortableHandle(() => (
    <Box>
      <SortHandle />
    </Box>
  ))

  if (isUploading) {
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
        <Box className={classes.mediaLabel}>Uploading...</Box>
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
            <SvgIcon path={mdiPencilOutline} />
          </IconButton>
          {name || (
            <Typography className={classes.mutedText}>
              {EMPTY_NAME_TEXT}
            </Typography>
          )}
        </Box>
      )}

      {editMode && (
        <ClickOutside onClickOutside={handleOnClickOutsideEdit}>
          <form noValidate autoComplete="off">
            <TextareaAutosize
              defaultValue={name}
              ref={textareaRef}
              onKeyDown={onKeyDown}
              className={classes.editTextArea}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={saveEdit}
              className={cn(classes.lowerCaseButton, 'save-btn')}
            >
              Save
            </Button>{' '}
            <Button
              onClick={cancelEdit}
              className={classes.lowerCaseButton}
              variant="outlined"
            >
              Cancel
            </Button>
          </form>
        </ClickOutside>
      )}
    </Box>
  )
}
