import React, { useState, useEffect } from 'react'
import {
  Theme,
  Button,
  Popover,
  TextField,
  Typography,
  makeStyles,
  InputAdornment
} from '@material-ui/core'
import { mdiClose } from '@mdi/js'
import pluralize from 'pluralize'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      width: '320px'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing(2, 3),
      borderBottom: `1px solid ${theme.palette.divider}`
    },
    close: {
      display: 'inline-flex',
      cursor: 'pointer'
    },
    fields: {
      padding: theme.spacing(2.5, 2)
    },
    inputField: {
      width: '100%',
      '&:not(:first-child)': { marginTop: theme.spacing(2.5) }
    }
  }),
  {
    name: 'ManageTagsEditMode'
  }
)

interface Props {
  tag: IContactTag & { highlight: boolean }
  loading: boolean
  anchorEl: Nullable<HTMLElement>
  handleClose: () => void
  onSave: (text: string, touchDate: Nullable<number>) => void
}

export function EditMode({
  tag,
  loading,
  anchorEl,
  onSave,
  handleClose
}: Props) {
  const classes = useStyles()
  const [isDirty, setIsDirty] = useState<boolean>(false)
  const [text, setText] = useState<string>(tag.text || '')
  const [touchDate, setTouchDate] = useState<Nullable<number>>(
    tag.touch_freq || 0
  )
  const open = Boolean(anchorEl)
  const id = open ? 'popover-edit-tag' : undefined

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    setText(value)
  }
  const handleTouchDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(event.target.value, 10)

    setTouchDate(value)
  }

  const handleOnSave = () => onSave(text, touchDate)

  useEffect(() => {
    if (text !== tag.text || touchDate !== tag.touch_freq) {
      setIsDirty(true)
    } else {
      setIsDirty(false)
    }
  }, [tag.text, tag.touch_freq, text, touchDate])

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
    >
      <div className={classes.container}>
        <div className={classes.header}>
          <Typography variant="h6">Edit Tag</Typography>
          <div className={classes.close} onClick={handleClose}>
            <SvgIcon path={mdiClose} />
          </div>
        </div>
        <div className={classes.fields}>
          <TextField
            id="title"
            label="Title"
            type="text"
            size="small"
            color="secondary"
            defaultValue={text}
            InputLabelProps={{
              shrink: true
            }}
            variant="outlined"
            className={classes.inputField}
            onChange={handleTitleChange}
          />
          <TextField
            id="touch-date"
            label="Touch Date"
            type="number"
            size="small"
            color="secondary"
            defaultValue={touchDate}
            InputLabelProps={{
              shrink: true
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {touchDate && touchDate > 0
                    ? pluralize('Day', touchDate)
                    : 'Day'}
                </InputAdornment>
              )
            }}
            variant="outlined"
            className={classes.inputField}
            onChange={handleTouchDateChange}
          />

          <Button
            color="secondary"
            variant="contained"
            disabled={loading || !isDirty}
            className={classes.inputField}
            onClick={handleOnSave}
          >
            Save
          </Button>
        </div>
      </div>
    </Popover>
  )
}
