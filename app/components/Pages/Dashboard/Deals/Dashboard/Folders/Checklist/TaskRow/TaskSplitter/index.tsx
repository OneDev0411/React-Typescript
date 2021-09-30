import React, { useEffect, useState } from 'react'

import {
  Box,
  TextField,
  IconButton,
  makeStyles,
  Typography,
  InputAdornment,
  Button,
  Theme
} from '@material-ui/core'
import { mdiPencil } from '@mdi/js'
import { useDispatch } from 'react-redux'

import { updateTask } from '@app/store_actions/deals'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      padding: theme.spacing(4, 0, 2, 0),
      margin: theme.spacing(0, 2, 0, 2),
      borderBottom: `1px solid ${theme.palette.grey[600]}`,
      '& .visible-on-hover': {
        visibility: 'hidden'
      },
      '&:hover .visible-on-hover': {
        visibility: 'visible'
      }
    },
    textField: {
      width: '300px'
    }
  }),
  {
    name: 'Checklist-TaskSplitter'
  }
)

interface Props {
  task: IDealTask
}

export function TaskSplitter({ task }: Props) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(task.title)

  useEffect(() => {
    setTitle(task.title)
  }, [task.title])

  const handleStartEditing = () => setIsEditing(true)

  const handleSaveTitle = () => {
    setIsEditing(false)

    dispatch(
      updateTask(task.id, {
        title
      })
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter') {
      handleSaveTitle()
    }
  }

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value)

  return (
    <Box className={classes.root} onDoubleClick={handleStartEditing}>
      {isEditing ? (
        <TextField
          className={classes.textField}
          label="Section Name"
          value={title}
          onChange={handleChangeTitle}
          onKeyDown={handleKeyDown}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button size="small" onClick={handleSaveTitle}>
                  Save
                </Button>
              </InputAdornment>
            )
          }}
        />
      ) : (
        <Box display="flex" alignItems="center">
          <Typography variant="subtitle1">{title}</Typography>
          <Box ml={2} className="visible-on-hover">
            <IconButton size="small" onClick={handleStartEditing}>
              <SvgIcon path={mdiPencil} size={muiIconSizes.small} />
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  )
}
