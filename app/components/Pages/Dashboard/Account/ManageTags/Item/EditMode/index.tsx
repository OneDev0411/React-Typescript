import React, { useState } from 'react'
import {
  Theme,
  Select,
  Button,
  Popover,
  MenuItem,
  TextField,
  InputLabel,
  makeStyles,
  Typography,
  FormControl
} from '@material-ui/core'
import pluralize from 'pluralize'
import { mdiClose } from '@mdi/js'

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
  console.log({ tag })

  const classes = useStyles()
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
    event: React.ChangeEvent<{ value: number }>
  ) => {
    const value = event.target.value

    setTouchDate(value)
  }

  const handleOnSave = () => onSave(text, touchDate)

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
            id="text"
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
          <FormControl
            variant="outlined"
            size="small"
            className={classes.inputField}
          >
            <InputLabel id="tag-touch-date">Touch Date</InputLabel>
            <Select
              labelId="tag-touch-date"
              id="tag-touch-date-select"
              color="secondary"
              value={touchDate}
              defaultValue={0}
              onChange={handleTouchDateChange}
              label="Touch Date"
            >
              <MenuItem value={0}>No touch reminder</MenuItem>
              {[1, 2, 3, 4, 5].map(item => (
                <MenuItem key={item} value={item}>
                  Every {pluralize('day', item, true)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            color="secondary"
            variant="contained"
            className={classes.inputField}
            onClick={handleOnSave}
          >
            Save
          </Button>
        </div>
      </div>
    </Popover>
  )
  // return (
  //   <>
  //     <TextField
  //       variant="standard"
  //       fullWidth
  //       autoFocus
  //       disabled={loading}
  //       value={value}
  //       onChange={({ target: { value } }) => onChange(value)}
  //     />
  //   </>
  // )
}
