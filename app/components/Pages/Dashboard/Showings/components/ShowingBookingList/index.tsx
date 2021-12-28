import { useState, useMemo, ReactNode } from 'react'

import { Box, Button, makeStyles } from '@material-ui/core'
import { mdiChevronDown, mdiChevronUp } from '@mdi/js'
import classNames from 'classnames'

import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'
import { Table } from 'components/Grid/Table'
import { TableColumn } from 'components/Grid/Table/types'

import {
  getShowingImage,
  getAppointmentDateLabel,
  getAppointmentTimeLabel,
  getAppointmentTitle
} from '../../helpers'
import ShowingColumnContactActions from '../ShowingColumnContactActions'
import ShowingColumnProperty from '../ShowingColumnProperty'
import ShowingEmptyState from '../ShowingEmptyState'

import ShowingBookingListColumnActions, {
  ShowingBookingListColumnActionsProps
} from './ShowingBookingListColumnActions'
import ShowingBookingListColumnBase from './ShowingBookingListColumnBase'
import ShowingBookingListColumnDateTime from './ShowingBookingListColumnDateTime'
import ShowingBookingListColumnNew from './ShowingBookingListColumnNew'
import ShowingBookingListColumnPerson from './ShowingBookingListColumnPerson'
import ShowingBookingListColumnStatus from './ShowingBookingListColumnStatus'
import ShowingBookingListEmptyState from './ShowingBookingListEmptyState'

const useStyles = makeStyles(
  theme => ({
    rowBase: {
      paddingRight: theme.spacing(1),
      '&:hover $hide': { opacity: 1 }
    },
    row: {},
    rowPast: { color: theme.palette.grey[700] },
    hide: {
      opacity: 0,
      transition: theme.transitions.create('opacity')
    }
  }),
  { name: 'ShowingBookingList' }
)

export interface ShowingBookingListProps
  extends Pick<
    ShowingBookingListColumnActionsProps,
    'onApprovalAction' | 'onAckAction'
  > {
  rows: IShowingAppointment<'showing'>[]
  emptyMessage: string
  hasPropertyColumn?: boolean
  hasPastBookingsFilter?: boolean
  stackDateAndTimeColumns?: boolean
  hasTextEmptyState?: boolean
  emptyButtonLabel?: string
  emptyButtonLink?: string
  emptyButtonTarget?: string
  emptyDescription?: ReactNode
}

function ShowingBookingList({
  rows,
  emptyMessage,
  onApprovalAction,
  hasPropertyColumn = false,
  onAckAction,
  hasPastBookingsFilter = false,
  stackDateAndTimeColumns = false,
  hasTextEmptyState = true,
  emptyButtonLabel,
  emptyButtonLink,
  emptyButtonTarget,
  emptyDescription
}: ShowingBookingListProps) {
  const classes = useStyles()
  const [showPastBookings, setShowPastBookings] = useState(false)

  const columns: TableColumn<IShowingAppointment<'showing'>>[] = [
    {
      id: 'new',
      width: '24px',
      sortable: false,
      render: ({ row }) => (
        <ShowingBookingListColumnNew isNew={!!row.notifications?.length} />
      )
    },
    {
      id: 'status',
      width: '125px',
      sortable: false,
      render: ({ row }) => (
        <ShowingBookingListColumnStatus status={row.status} />
      )
    },
    ...(hasPropertyColumn
      ? [
          {
            id: 'property',
            width: '25%',
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
    ...(stackDateAndTimeColumns
      ? [
          {
            id: 'date-time',
            width: '15%',
            render: ({ row }) => (
              <ShowingBookingListColumnDateTime
                time={row.time}
                duration={row.showing.duration}
              />
            )
          }
        ]
      : [
          {
            id: 'date',
            width: '120px',
            render: ({ row }) => (
              <ShowingBookingListColumnBase>
                {getAppointmentDateLabel(row.time)}
              </ShowingBookingListColumnBase>
            )
          },
          {
            id: 'tile',
            width: '15%',
            render: ({ row }) => (
              <ShowingBookingListColumnBase>
                {getAppointmentTimeLabel(row.time, row.showing.duration)}
              </ShowingBookingListColumnBase>
            )
          }
        ]),

    {
      id: 'person',
      width: '20%',
      sortable: false,
      render: ({ row }) => (
        <ShowingBookingListColumnPerson
          name={row.contact.display_name}
          company={row.contact.company}
        />
      )
    },
    {
      id: 'person-actions',
      width: '64px',
      sortable: false,
      render: ({ row }) => (
        <ShowingColumnContactActions
          contact={row.contact}
          className={classes.hide}
          spacing={2}
          compact
        />
      )
    },
    {
      id: 'body-actions',
      sortable: false,
      align: 'right',
      render: ({ row }) => (
        <ShowingBookingListColumnActions
          className={!row.notifications?.length ? classes.hide : undefined}
          status={row.status}
          showing={row.showing}
          appointmentId={row.id}
          approvals={row.approvals}
          notifications={row.notifications}
          onApprovalAction={onApprovalAction}
          contact={row.contact}
          feedback={row.feedback}
          onAckAction={onAckAction}
          buyerName={row.contact.display_name}
          buyerMessage={row.buyer_message}
          appointmentTitle={getAppointmentTitle(row)}
        />
      )
    }
  ]

  const toggleShowPastBookings = () => {
    setShowPastBookings(showPastBookings => !showPastBookings)
  }

  const visibleRows = useMemo<IShowingAppointment<'showing'>[]>(() => {
    if (!hasPastBookingsFilter || showPastBookings) {
      return rows
    }

    const currentTime = new Date().toISOString()
    const upcomingBookings = rows.filter(row => row.time >= currentTime)

    return upcomingBookings
  }, [hasPastBookingsFilter, rows, showPastBookings])

  const hasAnyPastRows = useMemo<boolean>(() => {
    if (!rows.length) {
      return false
    }

    const currentTime = new Date().toISOString()

    // This works because the appointment list is sorted by time
    return rows[rows.length - 1].time < currentTime
  }, [rows])

  const hiddenRowCount = rows.length - visibleRows.length

  const table = (
    <>
      <Table
        rows={visibleRows}
        totalRows={visibleRows.length}
        columns={columns}
        EmptyStateComponent={() =>
          hasTextEmptyState ? (
            <ShowingBookingListEmptyState message={emptyMessage || ''} />
          ) : (
            <ShowingEmptyState
              title={emptyMessage}
              buttonLabel={emptyButtonLabel}
              buttonLink={emptyButtonLink}
              buttonTarget={emptyButtonTarget}
              description={emptyDescription}
            />
          )
        }
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
            variant="outlined"
            onClick={toggleShowPastBookings}
            startIcon={
              showPastBookings ? (
                <SvgIcon path={mdiChevronUp} />
              ) : (
                <SvgIcon path={mdiChevronDown} />
              )
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
