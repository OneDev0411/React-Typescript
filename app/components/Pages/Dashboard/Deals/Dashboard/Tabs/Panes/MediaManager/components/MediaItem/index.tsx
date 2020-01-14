import React, { useContext, useState, useRef, useEffect } from 'react'
import { Box, Link, Button, TextField } from '@material-ui/core'
import cn from 'classnames'

import IconCircleCheck from 'components/SvgIcons/CircleCheck/IconCircleCheck'
import IconCircleClose from 'components/SvgIcons/CircleClose/IconCircleClose'
import IconEdit from 'components/SvgIcons/Edit/EditIcon'
import { useIconStyles } from 'views/../styles/use-icon-styles'

import { useStyles } from '../../styles'
import ActionsMenu from './ActionsMenu'
import SelectCheckbox from './SelectCheckbox'
import UploadProgessBar from './UploadProgessBar'

import { MediaManagerAPI } from '../../context'
import { IMediaItem } from '../../types'
import { setMediaName, setMediaAsUploaded } from '../../context/actions'

export default function MediaItem(props: IMediaItem) {
  const classes = useStyles()
  const iconClasses = useIconStyles()
  const inputRef = useRef<HTMLInputElement>(null)
  const { file, src, selected, name, order, isNew } = props

  const [uploadPercentage, setUploadPercentage] = useState<number>(0)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const { dispatch } = useContext(MediaManagerAPI)

  const fakeUpload = (cb: () => void) => {
    let timerId: any
    let percent: any

    percent = 0
    timerId = setInterval(function fakeUploader() {
      percent += 5
      setUploadPercentage(percent)

      // complete
      if (percent >= 100) {
        clearInterval(timerId)

        return cb()
      }
    }, 100)
  }

  useEffect(() => {
    if (isNew && !isUploading) {
      fakeUpload(() => {
        setIsUploading(false)
        dispatch(setMediaAsUploaded(file))
        console.log('Fake upload completed!')
      })
    }
  }, [])

  const [editMode, setEditMode] = useState<boolean>(false)

  useEffect(() => {
    if (editMode && inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [editMode, inputRef])

  const handleOnBlur = () => {
    setTimeout(() => {
      setEditMode(false)
    }, 100)
  }

  const renameMedia = () => {
    if (inputRef && inputRef.current) {
      const name = inputRef.current.value

      dispatch(setMediaName(file, name))
    }
  }

  const cancelEdit = (e: React.MouseEvent) => {
    e.preventDefault()
    setEditMode(false)
  }

  if (isNew) {
    return (
      <Box
        className={cn(classes.mediaCard, classes.mediaCardUploading)}
        order={order}
      >
        <Box className={classes.mediaThumbnailContainer}>
          <img src={src} className={classes.mediaThumbnail} alt="" />
          <UploadProgessBar value={uploadPercentage} />
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
        <img src={src} className={classes.mediaThumbnail} alt="" />
        <SelectCheckbox {...props} />
        <ActionsMenu {...props} />
      </Box>

      {!editMode && (
        <Button
          className={classes.mediaLabel}
          fullWidth
          onClick={() => setEditMode(true)}
        >
          {name}
          <IconEdit
            fillColor="#333"
            className={cn(
              iconClasses.small,
              iconClasses.leftMargin,
              classes.editButton
            )}
          />
        </Button>
      )}

      {editMode && (
        <form noValidate autoComplete="off">
          <TextField
            defaultValue={name}
            onBlur={handleOnBlur}
            inputRef={inputRef}
          />
          <Link href="#" onClick={renameMedia}>
            <IconCircleCheck
              fillColor="#3f51b5"
              className={cn(iconClasses.medium, iconClasses.rightMargin)}
            />
          </Link>
          <Link href="#" onClick={cancelEdit}>
            <IconCircleClose
              fillColor="#000"
              className={cn(iconClasses.medium)}
            />
          </Link>
        </form>
      )}
    </Box>
  )
}
