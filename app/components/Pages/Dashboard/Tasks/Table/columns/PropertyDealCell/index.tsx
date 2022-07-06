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

export function PropertyDealCell({ task }: Props) {
  const classes = useStyles()

  const associations = useMemo(
    () =>
      task.associations?.filter(association =>
        ['listing', 'deal'].includes(association.association_type)
      ),
    [task.associations]
  )

  const [listings, deals] = useMemo(() => {
    const listings: ICRMTaskAssociation<'listing'>[] | undefined =
      associations?.filter(
        association => association.association_type === 'listing'
      )
    const deals: ICRMTaskAssociation<'deal'>[] | undefined =
      associations?.filter(
        association => association.association_type === 'deal'
      )

    return [listings, deals]
  }, [associations])

  return (
    <div className={cn(classes.root, { done: task.status === 'DONE' })}>
      {deals && deals?.length > 0 && <div>{deals[0].deal?.title}</div>}
      {listings && listings?.length > 0 && (
        <div>{listings[0].listing?.property?.address.full_address}</div>
      )}
    </div>
  )
}
