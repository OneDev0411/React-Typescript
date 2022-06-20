import { KeyboardEvent, useEffect, useRef, useState } from 'react'

import { makeStyles, TextField, Theme } from '@material-ui/core'
import { useQueryClient } from 'react-query'

import { useMutation } from '@app/hooks/query'

import { list } from '../../../queries/keys'
import { ITasks } from '../../../types'

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
  taskId: UUID
  defaultValue: string
  closeHandler: () => void
}

export function InlineTitleCell({ taskId, defaultValue, closeHandler }: Props) {
  const classes = useStyles()
  const [value, setValue] = useState(defaultValue)
  const inputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()

  useEffect(() => {
    inputRef.current?.focus()
  }, [inputRef])

  const updateTitle = async ({ title }: { title: string }) => {
    console.log('here', title)

    return ['x']
  }

  const mutation = useMutation(updateTitle, {
    onMutate: async data => {
      await queryClient.cancelQueries(list())

      const previousContacts = queryClient.getQueryData<any>(list())

      if (previousContacts) {
        const nextData = previousContacts.pages.map(page => {
          return {
            ...page,
            data: page.data.map(task =>
              task.id === taskId
                ? {
                    ...task,
                    ...data
                  }
                : task
            )
          }
        })

        queryClient.setQueryData<any>(list(), {
          ...previousContacts,
          pages: nextData
        })
      }

      return { previousContacts }
    },
    onSuccess: data => {
      console.log('on success', data)
      // queryClient.setQueryData(['todo', { id: 5 }], data)
    }
  })

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      mutation.mutate({
        title: value
      })

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
