import { useEffect } from 'react'

import { Box, makeStyles } from '@material-ui/core'

import { Table } from 'components/Grid/Table'
import { TableColumn } from 'components/Grid/Table/types'
import LoadingContainer from 'components/LoadingContainer'
import useAsync from 'hooks/use-async'
import { searchContacts } from 'models/contacts/search-contacts'
import { goTo } from 'utils/go-to'

import ShowingColumnContactActions from '../ShowingColumnContactActions'
import ShowingEmptyState from '../ShowingEmptyState'

import ShowingDetailEmptyStateDescription from './ShowingDetailEmptyStateDescription'
import ShowingDetailTabVisitorsColumnLatestVisit from './ShowingDetailTabVisitorsColumnLatestVisit'
import ShowingDetailTabVisitorsColumnPerson from './ShowingDetailTabVisitorsColumnPerson'
import ShowingDetailTabVisitorsColumnTotalVisit from './ShowingDetailTabVisitorsColumnTotalVisit'
import useShowingGroupAppointmentByVisitorId from './use-showing-group-appointment-by-visitor-id'

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
  showing: IShowing<'showing'>
  appointments: IShowingAppointment<'showing'>[]
  showingBookingUrl?: string
}

function ShowingDetailTabVisitors({
  showing,
  appointments,
  showingBookingUrl
}: ShowingDetailTabVisitorsProps) {
  const classes = useStyles()
  const { data: contacts, run, isLoading } = useAsync<IContact[]>({ data: [] })

  const appointmentsByVisitorId =
    useShowingGroupAppointmentByVisitorId(appointments)

  const appointmentsContacts =
    appointments?.map(appointment => appointment?.contact) || []

  const uniqueAppointmentsContacts = [
    ...new Set(appointmentsContacts.map(item => item))
  ]

  const updatedAppointmentsContacts = uniqueAppointmentsContacts?.map(item => {
    return {
      ...item,
      hasAccessToContact:
        contacts?.findIndex(contact => contact.id === item.id) !== -1
    }
  })

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

  const columns: TableColumn<IContact & { hasAccessToContact: boolean }>[] = [
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
      render: ({ row }) =>
        row.hasAccessToContact ? (
          <ShowingColumnContactActions contact={row} className={classes.hide} />
        ) : (
          <></>
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
      sortable: false,
      render: ({ row }) => (
        <ShowingDetailTabVisitorsColumnLatestVisit
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
        rows={updatedAppointmentsContacts}
        totalRows={updatedAppointmentsContacts.length}
        columns={columns}
        loading={isLoading ? 'middle' : null}
        LoadingStateComponent={() => (
          <LoadingContainer style={{ padding: '20% 0' }} />
        )}
        EmptyStateComponent={() => (
          <ShowingEmptyState
            title="There are no visitors."
            buttonLabel="Open Booking Page"
            buttonLink={showingBookingUrl}
            buttonTarget="_blank"
            description={
              <ShowingDetailEmptyStateDescription
                showingBookingUrl={showingBookingUrl}
              />
            }
          />
        )}
        getTrProps={({ row }) => ({
          onClick: () =>
            row.hasAccessToContact ? handleRowClick(row.id) : () => {}
        })}
        classes={{ row: classes.row }}
      />
    </Box>
  )
}

export default ShowingDetailTabVisitors
