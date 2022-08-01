import { Box, makeStyles } from '@material-ui/core'
import { mdiAccountTie, mdiCheck, mdiEyeOutline, mdiOpenInNew } from '@mdi/js'
import classNames from 'classnames'

import { HeaderColumn } from '@app/views/components/Grid/Table/features/HeaderColumn'
import { useGridStyles } from '@app/views/components/Grid/Table/styles/default'
import { Table } from 'components/Grid/Table'
import { TableColumn } from 'components/Grid/Table/types'
import LoadingContainer from 'components/LoadingContainer'
import { goTo } from 'utils/go-to'

import { getShowingBookingPageUrl, getShowingImage } from '../../helpers'
import ShowingColumnProperty from '../ShowingColumnProperty'
import ShowingEmptyState from '../ShowingEmptyState'
import ShowingLabeledColumn from '../ShowingLabeledColumn'

import ShowingPropertyListColumnActions from './ShowingPropertyListColumnActions'
import useGetShowingNotificationCount from './use-get-showing-notification-count'
import useSortPropertiesByNotificationCount from './use-sort-properties-by-notification-count'

const useStyles = makeStyles(
  theme => ({
    row: {
      paddingRight: theme.spacing(2),
      '&:hover $actions': { opacity: 1 },
      '& .column:not(.heading)': {
        paddingLeft: theme.spacing(2)
      }
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
  showings: IShowing<'showing'>[]
}

function ShowingPropertyList({
  isLoading,
  showings: rows
}: ShowingPropertyListProps) {
  const classes = useStyles()
  const gridClasses = useGridStyles()

  const showingNotificationCount = useGetShowingNotificationCount(rows)

  const handleRowClick = (showingId: UUID) => {
    goTo(`/dashboard/showings/${showingId}/detail`)
  }

  const sortedRows = useSortPropertiesByNotificationCount(
    rows,
    showingNotificationCount
  )

  const columns: TableColumn<IShowing<'showing'>>[] = [
    {
      id: 'property',
      header: () => <HeaderColumn text="Property" iconPath={mdiOpenInNew} />,
      width: '30%',
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
      id: 'approved',
      header: () => <HeaderColumn text="Approved" iconPath={mdiCheck} />,
      width: '150px',
      sortable: false,
      render: ({ row }) => (
        <ShowingLabeledColumn alignCenter>
          <Box textAlign="center">{row.confirmed}</Box>
        </ShowingLabeledColumn>
      )
    },
    {
      id: 'total-visits',
      header: () => (
        <HeaderColumn text="Total Bookings" iconPath={mdiEyeOutline} />
      ),
      width: '220px',
      sortable: false,
      render: ({ row }) => (
        <ShowingLabeledColumn alignCenter>
          <Box textAlign="center">{row.visits}</Box>
        </ShowingLabeledColumn>
      )
    },
    {
      id: 'agent',
      header: () => <HeaderColumn text="Agent" iconPath={mdiAccountTie} />,
      width: '15%',
      sortable: false,
      render: ({ row }) => {
        const sellerAgent: Optional<IShowingRole> = row.roles.find(
          user => user.role === 'SellerAgent'
        )

        return (
          <ShowingLabeledColumn>
            {`${sellerAgent?.first_name} ${sellerAgent?.last_name}`}
          </ShowingLabeledColumn>
        )
      }
    },
    {
      header: '',
      id: 'body-actions',
      sortable: false,
      align: 'right',
      render: ({ row }) => (
        <ShowingPropertyListColumnActions
          className={classes.actions}
          bookingUrl={getShowingBookingPageUrl(row)}
          listingId={row.listing?.id || row.deal?.listing?.id}
        />
      )
    }
  ]

  return (
    <Box minHeight="320px">
      <Table
        headless={false}
        rows={sortedRows}
        totalRows={sortedRows.length}
        columns={columns}
        loading={isLoading ? 'middle' : null}
        LoadingStateComponent={() => (
          <LoadingContainer style={{ padding: '10% 0' }} />
        )}
        EmptyStateComponent={() => (
          <ShowingEmptyState
            title="There are no Showings."
            // eslint-disable-next-line max-len
            description="Create your first showing for your off-market or MLS listings under 2 minutes."
          />
        )}
        getTrProps={({ row }) => ({
          onClick: () => handleRowClick(row.id)
        })}
        classes={{ row: classNames(classes.row, gridClasses.row) }}
      />
    </Box>
  )
}

export default ShowingPropertyList
