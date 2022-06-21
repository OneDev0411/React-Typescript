import { memo, useState } from 'react'

import { useTheme, Theme, makeStyles } from '@material-ui/core'
import { mdiCheck } from '@mdi/js'
import cn from 'classnames'
import { useDispatch } from 'react-redux'

import { confirmation } from '@app/store_actions/confirmation'
import { muiIconSizes, SvgIcon } from '@app/views/components/SvgIcons'

import { useTaskMutation } from '../../../queries/use-task-mutation'
import type { ITask } from '../../../types'

const useStyles = makeStyles(
  (theme: Theme) => ({
    statusButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: theme.spacing(2.8),
      height: theme.spacing(2.8),
      borderRadius: '100%',
      border: '1px solid #000',
      backgroundColor: '#fff',
      '&.done': {
        backgroundColor: theme.palette.success.ultralight,
        border: `1px solid ${theme.palette.success.main}`
      },
      '& svg': {
        transform: 'scale(1.5)'
      }
    }
  }),
  {
    name: 'Tasks-TitleCell'
  }
)

interface Props {
  task: ITask
}

function StatusButtonCellComponent({ task }: Props) {
  const [status, setStatus] = useState(task.status)
  const classes = useStyles()
  const theme = useTheme<Theme>()
  const mutation = useTaskMutation(task)
  const dispatch = useDispatch()

  const handleChangeStatus = () => {
    const nextStatus: ICRMTaskStatus = status === 'DONE' ? 'PENDING' : 'DONE'

    if (nextStatus !== 'DONE') {
      changeStatus(nextStatus)

      return
    }

    dispatch(
      confirmation({
        message: 'Heads up!',
        description:
          'If you mark this event as done, the event due date will change to now. Are you sure?',
        confirmLabel: 'Confirm',
        onConfirm: () => changeStatus(nextStatus)
      })
    )
  }

  const changeStatus = (status: ICRMTaskStatus) => {
    setStatus(status)

    mutation.mutate({
      status,
      due_date: status === 'DONE' ? new Date().getTime() / 1000 : task.due_date
    })
  }

  return (
    <button
      type="button"
      onClick={handleChangeStatus}
      className={cn(classes.statusButton, {
        done: status === 'DONE'
      })}
    >
      <SvgIcon
        path={mdiCheck}
        size={muiIconSizes.large}
        color={status === 'DONE' ? theme.palette.success.main : '#000'}
      />
    </button>
  )
}

export const StatusButtonCell = memo(StatusButtonCellComponent)
