import { useCallback } from 'react'

import { AssociationPicker } from '@app/views/components/AssociationPicker'

import { useTaskAssociation } from '../../../hooks/use-task-association'
import { useTaskMutation } from '../../../queries/use-task-mutation'
import type { ITask } from '../../../types'

interface Props {
  task: ITask
}

export function InlineAssociationCell({ task }: Props) {
  const { mutate } = useTaskMutation(task)
  const taskAssociations = useTaskAssociation(
    task,
    ({ association_type }) =>
      ['deal', 'listing'].includes(association_type) === false
  )

  const handleChange = useCallback(
    associations => {
      setTimeout(() => {
        mutate({
          associations: [...taskAssociations, ...associations]
        })
      }, 0)
    },
    [mutate, taskAssociations]
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
