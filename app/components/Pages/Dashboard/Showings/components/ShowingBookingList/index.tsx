import { useState, useMemo } from 'react'
import classNames from 'classnames'
import { Box, Button, makeStyles } from '@material-ui/core'
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@material-ui/icons'

import { Table } from 'components/Grid/Table'
import { TableColumn } from 'components/Grid/Table/types'

import ShowingColumnProperty from '../ShowingColumnProperty'
import ShowingBookingListColumnActions, {
  ShowingBookingListColumnActionsProps
} from './ShowingBookingListColumnActions'
import ShowingBookingListColumnPerson from './ShowingBookingListColumnPerson'
import ShowingBookingListColumnStatus from './ShowingBookingListColumnStatus'
import ShowingBookingListEmptyState from './ShowingBookingListEmptyState'
import ShowingBookingListColumnDateTime from './ShowingBookingListColumnDateTime'
import { getShowingImage } from '../../helpers'
import ShowingBookingListColumnNew from './ShowingBookingListColumnNew'
import { getAppointmentFeedbackSubtitle } from './helpers'

const useStyles = makeStyles(
  theme => ({
    rowBase: {
      paddingRight: theme.spacing(1),
      '&:hover $actions': { opacity: 1 }
    },
    row: {},
    rowPast: { color: theme.palette.grey[700] },
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
  rows: IShowingAppointment[]
  emptyMessage: string
  hasPropertyColumn?: boolean
  hasPastBookingsFilter?: boolean
}

function ShowingBookingList({
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
      id: 'new',
      width: '40px',
      sortable: false,
      render: ({ row }) => (
        <ShowingBookingListColumnNew isNew={!!row.notifications?.length} />
      )
    },
    {
      id: 'status',
      width: '15%',
      sortable: false,
      render: ({ row }) => (
        <ShowingBookingListColumnStatus status={row.status} />
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
          contact={row.contact}
          feedback={row.feedback}
          onDismissAction={onDismissAction}
          buyerName={row.contact.display_name}
          buyerMessage={row.buyer_message}
          feedbackSubtitle={
            row.feedback ? getAppointmentFeedbackSubtitle(row) : undefined
          }
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

            row.time >= new Date().toISOString() ? classes.row : classes.rowPast
          )
        })}
      />
      {hasPastBookingsFilter && hasAnyPastRows && (
        <Box mt={3}>
          <Button
            size="small"
            color="secondary"
            variant="outlined"
            onClick={toggleShowPastBookings}
            startIcon={
              showPastBookings ? <ExpandLessIcon /> : <ExpandMoreIcon />
            }
          >
            {showPastBookings ? 'Hide' : 'Show'} Past Bookings
            {!showPastBookings &&
              hiddenRowCount &&
              ` (${hiddenRowCount} item${hiddenRowCount > 1 ? 's' : ''})`}
          </Button>
        </Box>
      )}
    </>
  )

  return <Box marginTop={6}>{table}</Box>
}

export default ShowingBookingList
