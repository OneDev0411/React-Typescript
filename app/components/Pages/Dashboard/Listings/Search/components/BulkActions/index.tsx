import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core'

import Acl from 'views/components/Acl'

import { resetRows } from 'components/Grid/Table/context/actions/selection/reset-rows'

import { StateContext, DispatchContext } from 'components/Grid/Table/context'

import { useGridContext } from 'components/Grid/Table/hooks/use-grid-context'

import CreateTourAction from '../CreateTourAction'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      '& button': {
        marginLeft: theme.spacing(1)
      }
    }
  })
)

interface Props {
  state: StateContext
  dispatch: DispatchContext
  isFetching: boolean
  totalRowsCount: number
  listings: ICompactListing[]
  user: IUser
}

export default function TableActions({ listings, user }: Props) {
  const [state, dispatch] = useGridContext()
  const classes = useStyles()

  const isAnyRowsSelected =
    state.selection.isEntireRowsSelected ||
    state.selection.selectedRowIds.length > 0

  const deselectRows = () => dispatch(resetRows())

  const selectedListings = listings.filter(listing =>
    state.selection.selectedRowIds.includes(listing.id)
  )

  return (
    <div className={classes.container}>
      <Acl.Crm>
        <CreateTourAction
          disabled={!isAnyRowsSelected}
          isExceeded={
            selectedListings.length > 27 || state.selection.isEntireRowsSelected
          }
          listings={selectedListings}
          submitCallback={deselectRows}
          user={user}
        />
      </Acl.Crm>
    </div>
  )
}
