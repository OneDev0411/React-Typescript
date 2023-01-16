import { useState } from 'react'

import { InputAdornment, makeStyles, TextField, Theme } from '@material-ui/core'
import { mdiMagnify } from '@mdi/js'
import { useDebounce } from 'react-use'

import { SvgIcon } from '../../SvgIcons'

const useStyles = makeStyles(
  (theme: Theme) => ({
    input: {
      backgroundColor: '#fff'
    },
    startAdornmentIcon: {
      color: theme.palette.action.active
    }
  }),
  {
    name: 'DocumentRepositorySearchField'
  }
)

interface Props {
  debounceTime: number
  defaultValue?: string
  onChange: (text: string) => void
}

export function SearchField({
  debounceTime,
  defaultValue = '',
  onChange
}: Props) {
  const classes = useStyles()
  const [text, setText] = useState(defaultValue)

  useDebounce(() => onChange(text), debounceTime, [text])

  return (
    <TextField
      variant="outlined"
      size="small"
      fullWidth
      placeholder="Search in all forms..."
      onChange={e => setText(e.target.value)}
      InputProps={{
        className: classes.input,
        startAdornment: (
          <InputAdornment position="start">
            <SvgIcon path={mdiMagnify} className={classes.startAdornmentIcon} />
          </InputAdornment>
        )
      }}
    />
  )
}
