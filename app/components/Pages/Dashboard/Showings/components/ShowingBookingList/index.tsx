import { useState, useMemo } from 'react'
import classNames from 'classnames'
import { Box, Button, makeStyles } from '@material-ui/core'

import { Table } from 'components/Grid/Table'
import { TableColumn } from 'components/Grid/Table/types'

import BoxWithTitle from '../BoxWithTitle'

import ShowingColumnProperty from '../ShowingColumnProperty'
import ShowingBookingListColumnActions, {
  ShowingBookingListColumnActionsProps
} from './ShowingBookingListColumnActions'
import ShowingBookingListColumnPerson from './ShowingBookingListColumnPerson'
import ShowingBookingListColumnStatus from './ShowingBookingListColumnStatus'
import ShowingBookingListEmptyState from './ShowingBookingListEmptyState'
import ShowingBookingListColumnDateTime from './ShowingBookingListColumnDateTime'
import { getShowingImage } from '../../helpers'

const useStyles = makeStyles(
  theme => ({
    rowBase: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1)
    },
    row: { '&:hover $actions': { opacity: 1 } },
    notificationRow: { borderLeft: `2px solid ${theme.palette.warning.light}` },
    actions: {
      opacity: 0,
      transition: theme.transitions.create('opacity')
    }
  }),
  { name: 'ShowingBookingList' }
)

export interface ShowingBookingListProps
  extends Pick<
    ShowingBookingListColumnActionsProps,
    'onApprovalAction' | 'onDismissAction'
  > {
  title?: string
  rows: IShowingAppointment[]
  emptyMessage: string
  hasPropertyColumn?: boolean
  hasPastBookingsFilter?: boolean
}

function ShowingBookingList({
  title,
  rows,
  emptyMessage,
  onApprovalAction,
  hasPropertyColumn = false,
  onDismissAction,
  hasPastBookingsFilter = false
}: ShowingBookingListProps) {
  const classes = useStyles()
  const [showPastBookings, setShowPastBookings] = useState(false)

  const columns: TableColumn<IShowingAppointment>[] = [
    {
      id: 'status',
      width: '15%',
      sortable: false,
      render: ({ row }) => (
        <ShowingBookingListColumnStatus
          status={row.status}
          feedbackRate={3} // TODO: use the value from the API response
        />
      )
    },
    ...(hasPropertyColumn
      ? [
          {
            id: 'property',
            width: '30%',
            render: ({ row }) => (
              <ShowingColumnProperty
                image={getShowingImage({
                  listing: row.showing.listing,
                  deal: row.showing.deal
                })}
                address={row.showing.title}
              />
            )
          }
        ]
      : []),
    {
      id: 'date-time',
      width: hasPropertyColumn ? '20%' : '25%',
      render: ({ row }) => (
        <ShowingBookingListColumnDateTime
          time={row.time}
          duration={(row.showing as IShowing).duration}
        />
      )
    },
    {
      id: 'agent',
      width: '15%',
      sortable: false,
      render: ({ row }) => (
        <ShowingBookingListColumnPerson
          name={row.contact.display_name}
          company={row.contact.company}
        />
      )
    },
    {
      id: 'body-actions',
      sortable: false,
      align: 'right',
      render: ({ row }) => (
        <ShowingBookingListColumnActions
          className={!row.notifications?.length ? classes.actions : undefined}
          status={row.status}
          showing={row.showing as IShowing}
          appointmentId={row.id}
          approvals={row.approvals}
          notifications={row.notifications}
          onApprovalAction={onApprovalAction}
          hasFeedback={false} // TODO: use this from the API response
          onDismissAction={onDismissAction}
          buyerName={row.contact.display_name}
          buyerMessage={row.buyer_message}
        />
      )
    }
  ]

  const toggleShowPastBookings = () => {
    setShowPastBookings(showPastBookings => !showPastBookings)
  }

  const visibleRows = useMemo<IShowingAppointment[]>(() => {
    if (!hasPastBookingsFilter || showPastBookings) {
      return rows
    }

    const time = new Date().toISOString()

    return rows.filter(row => row.time >= time)
  }, [hasPastBookingsFilter, rows, showPastBookings])

  const hasAnyPastRows = useMemo<boolean>(() => {
    if (!rows.length) {
      return false
    }

    const time = new Date().toISOString()

    // This works because the appointment list is sorted by time
    return rows[rows.length - 1].time < time
  }, [rows])

  const hiddenRowCount = rows.length - visibleRows.length

  const table = (
    <>
      {hasPastBookingsFilter && hasAnyPastRows && (
        <Button size="small" color="secondary" onClick={toggleShowPastBookings}>
          {showPastBookings ? 'Hide' : 'Show'} Past Bookings
          {!showPastBookings &&
            hiddenRowCount &&
            ` (${hiddenRowCount} item${hiddenRowCount > 1 ? 's' : ''})`}
        </Button>
      )}
      <Table
        rows={visibleRows}
        totalRows={visibleRows.length}
        columns={columns}
        EmptyStateComponent={() => (
          <ShowingBookingListEmptyState message={emptyMessage || ''} />
        )}
        virtualize={false}
        getTrProps={({ row }) => ({
          className: classNames(
            classes.rowBase,
            row.notifications?.length ? classes.notificationRow : classes.row
          )
        })}
      />
    </>
  )

  return title ? (
    <BoxWithTitle title={title} marginTop={6}>
      {table}
    </BoxWithTitle>
  ) : (
    <Box marginTop={6}>{table}</Box>
  )
}

export default ShowingBookingList
