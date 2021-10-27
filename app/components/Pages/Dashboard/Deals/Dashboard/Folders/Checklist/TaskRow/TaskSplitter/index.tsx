import { useEffect, useState, KeyboardEvent, ChangeEvent } from 'react'

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
import { mdiDelete, mdiPencil } from '@mdi/js'
import { useDispatch } from 'react-redux'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'
import { confirmation } from 'actions/confirmation'
import { updateTask, deleteTask } from 'actions/deals'

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
    },
    iconEdit: {
      color: `${theme.palette.grey['500']} !important`
    },
    iconDelete: {
      color: `${theme.palette.grey['500']} !important`,
      marginLeft: theme.spacing(1)
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

  const handleCancel = () => {
    setIsEditing(false)
    setTitle(task.title)
  }

  const handleSaveTitle = () => {
    setIsEditing(false)

    if (title.trim() === task.title) {
      return
    }

    dispatch(
      updateTask(task.id, {
        title: title.trim()
      })
    )
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter') {
      handleSaveTitle()
    }
  }

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value)

  const handleDelete = () => {
    dispatch(
      confirmation({
        message: 'Delete this section?',
        description: `You are deleting the ${title} section`,
        confirmLabel: 'Yes, Delete',
        onConfirm: () => dispatch(deleteTask(task.checklist, task.id))
      })
    )
  }

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
                <Box mb={0.5}>
                  <Button
                    size="small"
                    color="primary"
                    disabled={title.trim().length === 0}
                    onClick={handleSaveTitle}
                  >
                    Save
                  </Button>

                  <Button size="small" onClick={handleCancel}>
                    Cancel
                  </Button>
                </Box>
              </InputAdornment>
            )
          }}
        />
      ) : (
        <Box display="flex" alignItems="center">
          <Typography variant="subtitle1">{title}</Typography>
          <Box
            display="flex"
            alignItems="center"
            ml={4}
            className="visible-on-hover"
          >
            <IconButton
              size="small"
              className={classes.iconEdit}
              onClick={handleStartEditing}
            >
              <SvgIcon path={mdiPencil} size={muiIconSizes.small} />
            </IconButton>

            <IconButton
              size="small"
              className={classes.iconDelete}
              onClick={handleDelete}
            >
              <SvgIcon path={mdiDelete} size={muiIconSizes.small} />
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  )
}
