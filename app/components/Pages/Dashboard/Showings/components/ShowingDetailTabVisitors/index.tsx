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
import ShowingColumnContactActions from '../ShowingColumnContactActions'
import useShowingGroupAppointmentByVisitorId from './use-showing-group-appointment-by-visitor-id'
import ShowingBookingListEmptyState from '../ShowingBookingList/ShowingBookingListEmptyState'
import ShowingDetailTabVisitorsColumnLastVisit from './ShowingDetailTabVisitorsColumnLastVisit'

const useStyles = makeStyles(
  theme => ({
    row: {
      paddingRight: theme.spacing(1),
      '&:hover $hide': { opacity: 1 }
    },
    hide: {
      opacity: 0,
      transition: theme.transitions.create('opacity')
    }
  }),
  { name: 'ShowingDetailTabVisitors' }
)

interface ShowingDetailTabVisitorsProps {
  showing: IShowing
  appointments: IShowingAppointment[]
}

function ShowingDetailTabVisitors({
  showing,
  appointments
}: ShowingDetailTabVisitorsProps) {
  const classes = useStyles()
  const { data: contacts, run, isLoading } = useAsync<IContact[]>({ data: [] })

  const appointmentsByVisitorId = useShowingGroupAppointmentByVisitorId(
    appointments
  )

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
            [showing.id]
          )
        ).data
    )
  }, [run, showing.id])

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
      id: 'contact-action',
      width: '15%',
      sortable: false,
      render: ({ row }) => (
        <ShowingColumnContactActions contact={row} className={classes.hide} />
      )
    },
    {
      id: 'total-visits',
      width: '15%',
      sortable: false,
      render: ({ row }) => (
        <ShowingDetailTabVisitorsColumnTotalVisit
          duration={showing.duration}
          appointments={appointmentsByVisitorId[row.id]}
        />
      )
    },
    {
      id: 'actions',
      // width: 'auto',
      sortable: false,
      // align: 'right',
      render: ({ row }) => (
        <ShowingDetailTabVisitorsColumnLastVisit
          duration={showing.duration}
          appointment={
            appointmentsByVisitorId[row.id] &&
            appointmentsByVisitorId[row.id][0]
          }
        />
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
        EmptyStateComponent={() => (
          // TODO: finalize this empty state or move the component to the global scope
          <ShowingBookingListEmptyState message="There is no visitor." />
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
