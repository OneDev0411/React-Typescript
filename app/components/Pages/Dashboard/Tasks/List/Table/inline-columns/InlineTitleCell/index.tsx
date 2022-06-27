import { KeyboardEvent, useEffect, useRef, useState } from 'react'

import { makeStyles, TextField, Theme } from '@material-ui/core'

import { useTaskMutation } from '../../../../queries/use-task-mutation'
import type { ITask } from '../../../../types'

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
  task: ITask
  closeHandler: () => void
}

export function InlineTitleCell({ task, closeHandler }: Props) {
  const classes = useStyles()
  const [value, setValue] = useState(task.title)
  const inputRef = useRef<HTMLInputElement>(null)
  const mutation = useTaskMutation(task)

  useEffect(() => {
    inputRef.current?.focus()
  }, [inputRef])

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      mutation.mutate({
        title: value
      })

      closeHandler()
    }
  }

  const handleBlur = () => {
    mutation.mutate({
      title: value
    })
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
        onBlur={handleBlur}
        onChange={e => setValue(e.target.value)}
        onKeyPress={handleKeyPress}
      />
    </div>
  )
}
