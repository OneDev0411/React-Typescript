import { KeyboardEvent, useEffect, useRef, useState } from 'react'

import { makeStyles, TextField, Theme } from '@material-ui/core'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      minHeight: 'inherit',
      backgroundColor: '#f5f5f5'
    },
    inputRoot: {
      minHeight: 'inherit'
    },
    input: {
      padding: theme.spacing(0, 2),
      fontSize: '14px',
      minHeight: 'inherit'
    }
  }),
  {
    name: 'Tasks-InlineTitleCell'
  }
)

interface Props {
  defaultValue: string
  closeHandler: () => void
}

export function InlineTitleCell({ defaultValue, closeHandler }: Props) {
  const classes = useStyles()
  const [value, setValue] = useState(defaultValue)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [inputRef])

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log(value)
      closeHandler()
    }
  }

  return (
    <div className={classes.root}>
      <TextField
        fullWidth
        inputRef={inputRef}
        value={value}
        InputProps={{
          disableUnderline: true,
          classes: {
            root: classes.inputRoot,
            input: classes.input
          }
        }}
        className={classes.inputRoot}
        onChange={e => setValue(e.target.value)}
        onKeyPress={handleKeyPress}
      />
    </div>
  )
}
