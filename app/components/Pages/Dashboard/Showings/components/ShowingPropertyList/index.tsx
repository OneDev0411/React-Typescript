import { Box, makeStyles } from '@material-ui/core'

import { Table } from 'components/Grid/Table'
import { TableColumn } from 'components/Grid/Table/types'
import LoadingContainer from 'components/LoadingContainer'

import { goTo } from 'utils/go-to'

// import FeedbackStars from '../FeedbackStars'
import ShowingColumnProperty from '../ShowingColumnProperty'
import ShowingPropertyListColumnActions from './ShowingPropertyListColumnActions'
import ShowingPropertyListColumnNewChip from './ShowingPropertyListColumnNewChip'
import ShowingPropertyListColumnCount from './ShowingPropertyListColumnCount'
import useGetShowingNotificationCount from './use-get-showing-notification-count'
import BoxWithTitle from '../BoxWithTitle'

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
      width: '50%',
      primary: true,
      render: ({ row }) => (
        <ShowingColumnProperty
          deal={row.deal}
          listing={row.listing}
          address={row.address}
        />
      )
    },
    {
      id: 'new',
      width: '10%',
      sortable: false,
      render: ({ row }) => (
        <ShowingPropertyListColumnNewChip
          count={showingNotificationCount[row.id]}
        />
      )
    },
    {
      header: 'Approved',
      id: 'approved',
      width: '10%',
      sortable: false,
      render: ({ row }) => (
        <ShowingPropertyListColumnCount
          value={row.confirmed}
          label="Approved"
        />
      )
    },

    {
      header: 'Total Visits',
      id: 'total-visits',
      width: '10%',
      sortable: false,
      render: ({ row }) => (
        <ShowingPropertyListColumnCount
          value={row.visits}
          label="Total Visits"
        />
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
          bookingUrl={`/showings/${row.slug}-${row.human_readable_id}/book`}
        />
      )
    }
  ]

  return (
    <BoxWithTitle title="Properties">
      <Box minHeight="320px">
        <Table
          rows={rows}
          totalRows={rows.length}
          columns={columns}
          loading={isLoading ? 'middle' : null}
          LoadingStateComponent={() => (
            <LoadingContainer style={{ padding: '10% 0' }} />
          )}
          getTrProps={({ row }) => ({
            onClick: () => handleRowClick(row.id)
          })}
          classes={{ row: classes.row }}
        />
      </Box>
      {/* archivedItemCount > 0 && (
        <Box mt={1}>
          <LinkButton color="secondary" size="small">
            {archivedItemCount} Archived Showing
            {archivedItemCount > 1 ? 's' : ''}
          </LinkButton>
        </Box>
      ) */}
    </BoxWithTitle>
  )
}

export default ShowingPropertyList
