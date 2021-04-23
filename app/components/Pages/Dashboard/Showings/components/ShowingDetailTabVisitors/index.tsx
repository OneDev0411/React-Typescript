import { useEffect } from 'react'
import { Box, makeStyles } from '@material-ui/core'

import useAsync from 'hooks/use-async'
import { searchContacts } from 'models/contacts/search-contacts'
import { TableColumn } from 'components/Grid/Table/types'
import { Table } from 'components/Grid/Table'
import LoadingContainer from 'components/LoadingContainer'

import { goTo } from 'utils/go-to'

import ShowingDetailTabVisitorsColumnPerson from './ShowingDetailTabVisitorsColumnPerson'
import ShowingDetailTabVisitorsColumnTotalVisit from './ShowingDetailTabVisitorsColumnTotalVisit'
import ShowingDetailTabVisitorsColumnActions from './ShowingDetailTabVisitorsColumnActions'

const useStyles = makeStyles(
  theme => ({
    row: {
      '&:hover $actions': { opacity: 1 }
    },
    actions: { transition: theme.transitions.create('opacity') }
  }),
  { name: 'ShowingDetailTabVisitors' }
)

interface ShowingDetailTabVisitorsProps {
  showingId: UUID
}

function ShowingDetailTabVisitors({
  showingId
}: ShowingDetailTabVisitorsProps) {
  const classes = useStyles()
  const { data: contacts, run, isLoading } = useAsync<IContact[]>({ data: [] })

  useEffect(() => {
    run(
      async () =>
        (
          await searchContacts(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            [showingId]
          )
        ).data
    )
  }, [run, showingId])

  const columns: TableColumn<IContact>[] = [
    {
      header: 'Name',
      id: 'name',
      width: '30%',
      primary: true,
      render: ({ row }) => (
        <ShowingDetailTabVisitorsColumnPerson contact={row} />
      )
    },
    {
      header: 'Action',
      id: 'action',
      width: '20%',
      sortable: false,
      render: ({ row }) => (
        <ShowingDetailTabVisitorsColumnActions
          contact={row}
          className={classes.actions}
        />
      )
    },
    {
      header: 'Total Visits',
      id: 'total-visits',
      width: '50%',
      sortable: false,
      render: ({ row }) => (
        <ShowingDetailTabVisitorsColumnTotalVisit count={0} />
      )
    }
  ]

  const handleRowClick = (id: UUID) => {
    goTo(`/dashboard/contacts/${id}`)
  }

  return (
    <Box minHeight={300}>
      <Table
        rows={contacts}
        totalRows={contacts.length}
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
  )
}

export default ShowingDetailTabVisitors
