import { useCallback } from 'react'

import { AssociationPicker } from '@app/views/components/AssociationPicker'

import { useTaskMutation } from '../../../queries/use-task-mutation'
import type { ITask } from '../../../types'

interface Props {
  task: ITask
}

export function InlineAssociationCell({ task }: Props) {
  const { mutate } = useTaskMutation(task)

  const handleChange = useCallback(
    associations => {
      setTimeout(() => {
        mutate({
          associations
        })
      }, 0)
    },
    [mutate]
  )

  return (
    <AssociationPicker<ICRMTaskAssociation<'deal' | 'listing'>>
      defaultAssociations={task.associations?.filter(
        association =>
          association.association_type === 'deal' ||
          association.association_type === 'listing'
      )}
      onChange={handleChange}
    />
  )
}
