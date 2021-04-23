import { makeStyles } from '@material-ui/core'

import { Table } from 'components/Grid/Table'
import { TableColumn } from 'components/Grid/Table/types'

import BoxWithTitle from '../BoxWithTitle'

import { getAppointmentDateLabel, getAppointmentTimeLabel } from './helpers'
import ShowingDetailTabBookingsListColumnActions from './ShowingDetailTabBookingsListColumnActions'
import ShowingDetailTabBookingsListColumnBase from './ShowingDetailTabBookingsListColumnBase'
import ShowingDetailTabBookingsListColumnPerson from './ShowingDetailTabBookingsListColumnPerson'
import ShowingDetailTabBookingsListColumnStatus from './ShowingDetailTabBookingsListColumnStatus'

const useStyles = makeStyles(
  theme => ({
    row: { '&:hover $actions': { opacity: 1 } },
    actions: {
      opacity: 0,
      transition: theme.transitions.create('opacity')
    }
  }),
  { name: 'ShowingDetailTabBookingsList' }
)

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
  const classes = useStyles()
  const rows = appointments.filter(appointment => appointment.status === filter)

  const columns: TableColumn<IShowingAppointment>[] = [
    {
      id: 'date',
      width: '20%',
      primary: true,
      render: ({ row }) => (
        <ShowingDetailTabBookingsListColumnBase>
          {getAppointmentDateLabel(row.time)}
        </ShowingDetailTabBookingsListColumnBase>
      )
    },
    {
      id: 'time',
      width: '20%',
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
      align: 'right',
      render: ({ row }) => (
        <ShowingDetailTabBookingsListColumnActions
          className={classes.actions}
          status={row.status}
          appointmentId={row.id}
          hasFeedback={false} // TODO: use this from the API response
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
        classes={{ row: classes.row }}
      />
    </BoxWithTitle>
  )
}

export default ShowingDetailTabBookingsList
