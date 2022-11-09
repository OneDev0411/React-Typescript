import { useMemo } from 'react'

import { ITask } from '../types'

export function useTaskAssociation(
  task: ITask,
  filter: (
    association: ICRMTaskAssociation<'contact' | 'deal' | 'listing'>
  ) => boolean = () => true
) {
  const list = useMemo(() => {
    return (
      task.associations?.filter(filter)?.map(association => ({
        association_type: association.association_type,
        id: association.id,
        [association.association_type]:
          association[association.association_type]
      })) ?? []
    )
  }, [task, filter]) as unknown as TaskAssociation[]

  return list
}
