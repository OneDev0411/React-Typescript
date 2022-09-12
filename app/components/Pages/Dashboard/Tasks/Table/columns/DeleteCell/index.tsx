import { IconButton, makeStyles, Theme } from '@material-ui/core'
import { mdiTrashCanOutline } from '@mdi/js'
import cn from 'classnames'
import { useDispatch } from 'react-redux'

import useNotify from '@app/hooks/use-notify'
import { confirmation } from '@app/store_actions/confirmation'
import { muiIconSizes, SvgIcon } from '@app/views/components/SvgIcons'

import { useDeleteTaskMutation } from '../../../queries/use-delete-task-mutation'
import { ITask } from '../../../types'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      position: 'absolute',
      right: theme.spacing(2.5),
      top: '50%',
      transform: 'translate(-50%, -50%)',
      marginRight: theme.spacing(1),
      background: theme.palette.common.white,
      boxShadow: theme.shadows[1],
      '&:hover': {
        background: theme.palette.common.white
      }
    }
  }),
  {
    name: 'Tasks-DeleteCell'
  }
)

interface Props {
  task: ITask
}

export function DeleteCell({ task }: Props) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const { mutateAsync } = useDeleteTaskMutation()
  const notify = useNotify()

  const handleDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()

    dispatch(
      confirmation({
        message: 'Delete Task',
        description: 'Are you sure you want to delete this task?',
        confirmLabel: 'Yes, Delete',
        onConfirm: handleConfirmDelete
      })
    )
  }

  const handleConfirmDelete = async () => {
    try {
      await mutateAsync(task)
      notify({
        status: 'success',
        message: `"${task.title}" deleted.`
      })
    } catch (e) {
      notify({
        status: 'error',
        message: `Could not delete "${task.title}". Please try again.`
      })
    }
  }

  return (
    <IconButton
      className={cn(classes.root, 'delete-task-button')}
      size="small"
      onClick={handleDelete}
    >
      <SvgIcon path={mdiTrashCanOutline} size={muiIconSizes.small} />
    </IconButton>
  )
}
