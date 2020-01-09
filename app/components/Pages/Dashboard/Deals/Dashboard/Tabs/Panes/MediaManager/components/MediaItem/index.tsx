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
import { MediaManagerAPI } from '../../context'
import { IMediaItem } from '../../types'

export default function MediaItem(props: IMediaItem) {
  const classes = useStyles()
  const iconClasses = useIconStyles()
  const inputRef = useRef<HTMLInputElement>(null)
  const { file, src, selected, name, order } = props

  const [editMode, setEditMode] = useState(false)
  const api = useContext(MediaManagerAPI)

  // const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { value } = e.target
  //   api && api.setMediaName(file, value)
  // }

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

      api && api.setMediaName(file, name)
    }
  }

  const cancelEdit = (e: React.MouseEvent) => {
    e.preventDefault()
    setEditMode(false)
  }

  return (
    <Box className={cn(classes.mediaCard, { selected })} order={order}>
      <Box className={classes.mediaThumbnailContainer}>
        <img src={src} className={classes.mediaThumbnail} alt="" />
        <SelectCheckbox {...props} />
        <ActionsMenu />
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
