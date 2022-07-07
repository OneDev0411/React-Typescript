import { memo, useState } from 'react'

import { useTheme, Theme, IconButton } from '@material-ui/core'
import { mdiCheckCircle, mdiCheckCircleOutline } from '@mdi/js'

import { muiIconSizes, SvgIcon } from '@app/views/components/SvgIcons'

import { useTaskMutation } from '../../../queries/use-task-mutation'
import type { ITask } from '../../../types'

interface Props {
  task: ITask
}

function StatusButtonCellComponent({ task }: Props) {
  const [status, setStatus] = useState(task.status)
  const theme = useTheme<Theme>()
  const mutation = useTaskMutation(task)
  const isTaskDone = status === 'DONE'

  const handleChangeStatus = () => {
    const nextStatus: ICRMTaskStatus = status === 'DONE' ? 'PENDING' : 'DONE'

    setStatus(nextStatus)

    mutation.mutate({
      status: nextStatus
    })
  }

  return (
    <IconButton size="small" onClick={handleChangeStatus}>
      <SvgIcon
        path={isTaskDone ? mdiCheckCircle : mdiCheckCircleOutline}
        size={muiIconSizes.medium}
        color={
          isTaskDone ? theme.palette.success.main : theme.palette.grey[400]
        }
      />
    </IconButton>
  )
}

export const StatusButtonCell = memo(StatusButtonCellComponent)
