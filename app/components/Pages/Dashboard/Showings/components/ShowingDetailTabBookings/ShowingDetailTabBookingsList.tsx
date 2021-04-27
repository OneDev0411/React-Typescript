import classNames from 'classnames'
import { Box, makeStyles } from '@material-ui/core'

import { Table } from 'components/Grid/Table'
import { TableColumn } from 'components/Grid/Table/types'

import BoxWithTitle from '../BoxWithTitle'

import { getAppointmentDateLabel, getAppointmentTimeLabel } from './helpers'
import ShowingDetailTabBookingsListColumnActions from './ShowingDetailTabBookingsListColumnActions'
import ShowingDetailTabBookingsListColumnBase from './ShowingDetailTabBookingsListColumnBase'
import ShowingDetailTabBookingsListColumnPerson from './ShowingDetailTabBookingsListColumnPerson'
import ShowingDetailTabBookingsListColumnStatus from './ShowingDetailTabBookingsListColumnStatus'
import ShowingDetailTabBookingsListEmptyState from './ShowingDetailTabBookingsListEmptyState'

const useStyles = makeStyles(
  theme => ({
    rowBase: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1)
    },
    row: { '&:hover $actions': { opacity: 1 } },
    glowRow: { '&&': { backgroundColor: theme.palette.warning.ultralight } },
    actions: {
      opacity: 0,
      transition: theme.transitions.create('opacity')
    }
  }),
  { name: 'ShowingDetailTabBookingsList' }
)

interface ShowingDetailTabBookingsListProps {
  title?: string
  rows: IShowingAppointment[]
  duration: number
  glowMode?: boolean
  emptyMessage?: string
  hideEmptyMessage?: boolean
}

function ShowingDetailTabBookingsList({
  title,
  rows,
  duration,
  glowMode = false,
  emptyMessage,
  hideEmptyMessage = false
}: ShowingDetailTabBookingsListProps) {
  const classes = useStyles()

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
          className={!glowMode ? classes.actions : undefined}
          status={row.status}
          appointmentId={row.id}
          hasFeedback={false} // TODO: use this from the API response
        />
      )
    }
  ]

  if ((!emptyMessage || hideEmptyMessage) && !rows.length) {
    return null
  }

  const table = (
    <Table
      rows={rows}
      totalRows={rows.length}
      columns={columns}
      EmptyStateComponent={() => (
        <ShowingDetailTabBookingsListEmptyState message={emptyMessage || ''} />
      )}
      classes={{
        row: classNames(
          classes.rowBase,
          glowMode ? classes.glowRow : classes.row
        )
      }}
    />
  )

  return title ? (
    <BoxWithTitle title={title} marginTop={6}>
      {table}
    </BoxWithTitle>
  ) : (
    <Box marginTop={6}>{table}</Box>
  )
}

export default ShowingDetailTabBookingsList
