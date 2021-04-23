import { Table } from 'components/Grid/Table'
import { TableColumn } from 'components/Grid/Table/types'

import BoxWithTitle from '../BoxWithTitle'

import { getAppointmentDateLabel, getAppointmentTimeLabel } from './helpers'
import ShowingDetailTabBookingsListColumnActions from './ShowingDetailTabBookingsListColumnActions'
import ShowingDetailTabBookingsListColumnBase from './ShowingDetailTabBookingsListColumnBase'
import ShowingDetailTabBookingsListColumnPerson from './ShowingDetailTabBookingsListColumnPerson'
import ShowingDetailTabBookingsListColumnStatus from './ShowingDetailTabBookingsListColumnStatus'

interface ShowingDetailTabBookingsListProps {
  filter: IAppointmentStatus
  appointments: IShowingAppointment[]
  duration: number
}

function ShowingDetailTabBookingsList({
  filter,
  appointments,
  duration
}: ShowingDetailTabBookingsListProps) {
  const rows = appointments.filter(appointment => appointment.status === filter)

  const columns: TableColumn<IShowingAppointment>[] = [
    {
      id: 'date',
      width: '15%',
      primary: true,
      render: ({ row }) => (
        <ShowingDetailTabBookingsListColumnBase>
          {getAppointmentDateLabel(row.time)}
        </ShowingDetailTabBookingsListColumnBase>
      )
    },
    {
      id: 'time',
      width: '15%',
      sortable: false,
      render: ({ row }) => (
        <ShowingDetailTabBookingsListColumnBase>
          {getAppointmentTimeLabel(row.time, duration)}
        </ShowingDetailTabBookingsListColumnBase>
      )
    },
    {
      id: 'agent',
      width: '15%',
      sortable: false,
      render: ({ row }) => (
        <ShowingDetailTabBookingsListColumnPerson
          name={row.contact.display_name}
          company={row.contact.company}
        />
      )
    },

    {
      id: 'status',
      width: '20%',
      sortable: false,
      render: ({ row }) => (
        <ShowingDetailTabBookingsListColumnStatus
          status={row.status}
          feedbackRate={3} // TODO: use the value from the API response
        />
      )
    },
    {
      id: 'body-actions',
      sortable: false,
      render: ({ row }) => (
        <ShowingDetailTabBookingsListColumnActions
          status={row.status}
          appointmentId={row.id}
        />
      )
    }
  ]

  return (
    <BoxWithTitle title={filter} marginTop={6}>
      <Table
        rows={rows}
        totalRows={rows.length}
        columns={columns}
        EmptyStateComponent={() => <>Empty State</>}
        // loading={isLoading ? 'middle' : null}
        // LoadingStateComponent={() => (
        //   <LoadingContainer style={{ padding: '20% 0' }} />
        // )}
        // getTrProps={({ row }) => ({
        //   onClick: () => handleRowClick(row.id)
        // })}
        // classes={{
        //   row: classes.row
        // }}
      />
    </BoxWithTitle>
  )
}

export default ShowingDetailTabBookingsList
