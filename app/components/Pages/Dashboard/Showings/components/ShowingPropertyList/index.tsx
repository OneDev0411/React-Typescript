import { Box, makeStyles } from '@material-ui/core'

import { Table } from 'components/Grid/Table'
import { TableColumn } from 'components/Grid/Table/types'
import LoadingContainer from 'components/LoadingContainer'

import { goTo } from 'utils/go-to'

import ShowingColumnProperty from '../ShowingColumnProperty'
import ShowingPropertyListColumnActions from './ShowingPropertyListColumnActions'
import useGetShowingNotificationCount from './use-get-showing-notification-count'
import { getShowingBookingPageUrl, getShowingImage } from '../../helpers'
import useSortPropertiesByNotificationCount from './use-sort-properties-by-notification-count'
import ShowingEmptyState from '../ShowingEmptyState'
import ShowingLabeledColumn from '../ShowingLabeledColumn'

const useStyles = makeStyles(
  theme => ({
    row: {
      '&:hover $actions': { opacity: 1 }
    },
    actions: {
      transition: theme.transitions.create('opacity'),
      opacity: 0
    }
  }),
  { name: 'ShowingPropertyList' }
)

interface ShowingPropertyListProps {
  isLoading?: boolean
  showings: IShowing[]
}

function ShowingPropertyList({
  isLoading,
  showings: rows
}: ShowingPropertyListProps) {
  const classes = useStyles()

  const showingNotificationCount = useGetShowingNotificationCount(rows)

  const handleRowClick = (showingId: UUID) => {
    goTo(`/dashboard/showings/${showingId}/detail`)
  }

  const columns: TableColumn<IShowing>[] = [
    {
      id: 'property',
      width: '40%',
      primary: true,
      render: ({ row }) => (
        <ShowingColumnProperty
          image={getShowingImage({ listing: row.listing, deal: row.deal })}
          address={row.title}
          badge={showingNotificationCount[row.id]}
        />
      )
    },
    {
      header: 'Approved',
      id: 'approved',
      width: '10%',
      sortable: false,
      render: ({ row }) => (
        <ShowingLabeledColumn label="Approved">
          {row.confirmed}
        </ShowingLabeledColumn>
      )
    },

    {
      header: 'Total Visits',
      id: 'total-visits',
      width: '10%',
      sortable: false,
      render: ({ row }) => (
        <ShowingLabeledColumn label="Total Visits">
          {row.visits}
        </ShowingLabeledColumn>
      )
    },
    // {
    //   header: 'Feedback',
    //   id: 'feedback',
    //   width: '15%',
    //   sortable: false,
    //   render: ({ row }) => (
    //     // TODO: use the feedback rate from API response
    //     <FeedbackStars value={random(5)} />
    //   )
    // },
    {
      header: 'Body',
      id: 'body-actions',
      sortable: false,
      render: ({ row }) => (
        <ShowingPropertyListColumnActions
          className={classes.actions}
          bookingUrl={getShowingBookingPageUrl(row)}
        />
      )
    }
  ]

  const sortedRows = useSortPropertiesByNotificationCount(
    rows,
    showingNotificationCount
  )

  return (
    <Box minHeight="320px">
      <Table
        rows={sortedRows}
        totalRows={sortedRows.length}
        columns={columns}
        loading={isLoading ? 'middle' : null}
        LoadingStateComponent={() => (
          <LoadingContainer style={{ padding: '10% 0' }} />
        )}
        EmptyStateComponent={() => (
          <ShowingEmptyState title="There are no properties." />
        )}
        getTrProps={({ row }) => ({
          onClick: () => handleRowClick(row.id)
        })}
        classes={{ row: classes.row }}
        virtualize={false}
      />
    </Box>
  )
}

export default ShowingPropertyList
