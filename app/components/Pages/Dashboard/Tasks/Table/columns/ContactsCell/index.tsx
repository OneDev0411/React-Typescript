import { useMemo } from 'react'

import { makeStyles, Theme } from '@material-ui/core'
import cn from 'classnames'

import type { ITask } from '../../../types'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      '&.done': {
        color: theme.palette.grey[400]
      }
    }
  }),
  {
    name: 'Tasks-ContactsCell'
  }
)

interface Props {
  task: ITask
}

export function ContactsCell({ task }: Props) {
  const classes = useStyles()

  const contactAssociations = useMemo(
    () =>
      task.associations?.filter(
        association => association.association_type === 'contact'
      ),
    [task.associations]
  )

  const list = contactAssociations?.map(({ contact }) => contact?.display_name)

  return (
    <div
      className={cn(classes.root, 'overflow-ellipsis', {
        done: task.status === 'DONE'
      })}
    >
      {list?.join(', ')}
    </div>
  )
}
