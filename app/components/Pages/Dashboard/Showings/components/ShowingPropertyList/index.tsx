import React, { useEffect } from 'react'
import { Box, makeStyles, Typography } from '@material-ui/core'

import { random } from 'underscore'

import { Table } from 'components/Grid/Table'
import { TableColumn } from 'components/Grid/Table/types'
import LoadingContainer from 'components/LoadingContainer'
import useAsync from 'hooks/use-async'
import getShowings from 'models/showing/get-showings'

import { goTo } from 'utils/go-to'

import ShowingPropertyListColumnProperty from './ShowingPropertyListColumnProperty'
import BoxWithTitle from '../BoxWithTitle'
import LinkButton from '../LinkButton'
import ShowingPropertyListColumnActions from './ShowingPropertyListColumnActions'
import ShowingPropertyListColumnFeedback from './ShowingPropertyListColumnFeedback'

const useStyles = makeStyles(
  theme => ({
    row: {
      '&:hover $actions': { opacity: 1 }
    },
    actions: {
      transition: theme.transitions.create('opacity'),
      opacity: 0
    }
  }),
  { name: 'ShowingPropertyList' }
)

function ShowingPropertyList() {
  const classes = useStyles()

  const { data: rows, isLoading, run } = useAsync<IShowing[]>({ data: [] })

  useEffect(() => {
    run(getShowings)
  }, [run])

  const topRows = rows.slice(0, 5)
  const archivedItemCount = rows.length - 5

  const handleRowClick = (showingId: UUID) => {
    goTo(`/dashboard/showings/${showingId}/detail`)
  }

  const columns: TableColumn<IShowing>[] = [
    {
      header: 'Property',
      id: 'property',
      width: '30%',
      primary: true,
      render: ({ row }) => (
        <ShowingPropertyListColumnProperty
          deal={row.deal}
          listing={row.listing}
          address={row.address}
        />
      )
    },
    {
      header: 'Needs Confirmation',
      id: 'needs-confirmation',
      width: '10%',
      sortable: false,
      render: ({ row }) => (
        <Typography noWrap variant="body2">
          0
        </Typography>
      )
    },
    {
      header: 'Upcoming',
      id: 'upcoming',
      width: '10%',
      sortable: false,
      render: ({ row }) => (
        <Typography noWrap variant="body2">
          0
        </Typography>
      )
    },
    {
      header: 'Total Visits',
      id: 'total-visits',
      width: '10%',
      sortable: false,
      render: ({ row }) => (
        <Typography noWrap variant="body2">
          0
        </Typography>
      )
    },
    {
      header: 'Feedback',
      id: 'total-visits',
      width: '15%',
      sortable: false,
      render: ({ row }) => (
        <ShowingPropertyListColumnFeedback value={random(5)} />
      )
    },
    {
      header: 'Body',
      id: 'body-actions',
      sortable: false,
      render: ({ row }) => (
        <ShowingPropertyListColumnActions
          className={classes.actions}
          showingId={row.id}
        />
      )
    }
  ]

  return (
    <BoxWithTitle title="Properties">
      <Box minHeight="320px">
        <Table
          rows={topRows}
          totalRows={topRows.length}
          columns={columns}
          loading={isLoading ? 'middle' : null}
          LoadingStateComponent={() => (
            <LoadingContainer style={{ padding: '20% 0' }} />
          )}
          getTrProps={({ row }) => ({
            onClick: () => handleRowClick(row.id)
          })}
          classes={{ row: classes.row }}
        />
      </Box>
      {archivedItemCount > 0 && (
        <Box mt={1}>
          <LinkButton color="secondary" size="small">
            {archivedItemCount} Archived Showing
            {archivedItemCount > 1 ? 's' : ''}
          </LinkButton>
        </Box>
      )}
    </BoxWithTitle>
  )
}

export default ShowingPropertyList
