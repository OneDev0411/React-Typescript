import classNames from 'classnames'
import { Box, makeStyles } from '@material-ui/core'

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
    notificationRow: {
      '&&': { backgroundColor: theme.palette.warning.ultralight }
    },
    actions: {
      opacity: 0,
      transition: theme.transitions.create('opacity')
    }
  }),
  { name: 'ShowingBookingList' }
)

export interface ShowingBookingListProps {
  title?: string
  rows: IShowingAppointment[]
  notificationMode?: boolean
  emptyMessage?: string
  hideEmptyMessage?: boolean
  onApprovalAction?: ShowingBookingListColumnActionsProps['onApprovalAction']
  hasPropertyColumn?: boolean
}

function ShowingBookingList({
  title,
  rows,
  notificationMode = false,
  emptyMessage,
  hideEmptyMessage = false,
  onApprovalAction,
  hasPropertyColumn = false
}: ShowingBookingListProps) {
  const classes = useStyles()

  const columns: TableColumn<IShowingAppointment>[] = [
    ...(hasPropertyColumn
      ? [
          {
            id: 'property',
            width: '30%',
            primary: true,
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
    {
      id: 'date-time',
      width: hasPropertyColumn ? '20%' : '25%',
      primary: true,
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
          className={!notificationMode ? classes.actions : undefined}
          status={row.status}
          showing={row.showing as IShowing}
          appointmentId={row.id}
          approvals={row.approvals}
          notifications={row.notifications}
          onApprovalAction={onApprovalAction}
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
        <ShowingBookingListEmptyState message={emptyMessage || ''} />
      )}
      classes={{
        row: classNames(
          classes.rowBase,
          notificationMode ? classes.notificationRow : classes.row
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

export default ShowingBookingList
