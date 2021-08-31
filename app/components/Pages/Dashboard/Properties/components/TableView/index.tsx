import { useCallback, useState } from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  makeStyles,
  Checkbox
} from '@material-ui/core'
import cn from 'classnames'
import pluralize from 'pluralize'
import { useSelector } from 'react-redux'

import {
  metersToFeet,
  addressTitle,
  getListingFormatedPrice,
  getListingPricePerSquareFoot
} from '@app/utils/listing'
import { useListSelection } from '@app/views/components/ListSelection/use-list-selection'
import { ListingDetailsModal } from 'components/ListingDetailsModal'
import { selectUserUnsafe } from 'selectors/user'

import { changeListingHoverState } from '../../ExploreTab/context/actions'
import useListingsContext from '../../ExploreTab/hooks/useListingsContext'

const useStyles = makeStyles(
  () => ({
    row: {
      '&.hover, &.selected': {
        backgroundColor: '#eee',
        cursor: 'pointer'
      }
    }
  }),
  { name: 'ListingsTable' }
)

interface Props {
  listings: ICompactListing[]
  mapIsShown: boolean
  isWidget: boolean
}

const CELL_FALLBACK = '--'
const MLS_BASE_URL = '/dashboard/properties'

interface TableColumnItem {
  header: string
  id: string
  render: (listing: ICompactListing, user: Nullable<IUser>) => React.ReactNode
}

const primaryColumns: TableColumnItem[] = [
  {
    header: 'Address',
    id: 'address',
    render: listing => `${addressTitle(listing.address)}`
  },
  {
    header: 'Status',
    id: 'status',
    render: listing => `${listing.status}`
  },
  {
    header: 'Price',
    id: 'price',
    render: (listing, user) =>
      `$${getListingFormatedPrice(listing, user, false)}`
  },
  {
    header: 'Beds',
    id: 'beds',
    render: listing =>
      `${pluralize('bed', listing.compact_property.bedroom_count ?? 0, true)}`
  },
  {
    header: 'Baths',
    id: 'baths',
    render: listing =>
      `${pluralize('bath', listing.compact_property.bathroom_count ?? 0, true)}`
  }
]

const secondaryColumns: TableColumnItem[] = [
  {
    header: 'sqft',
    id: 'sqft',
    // TODO: add helper to format numbers
    render: listing =>
      listing.compact_property.square_meters
        ? `${metersToFeet(
            listing.compact_property.square_meters
          ).toLocaleString('en-US', { maximumFractionDigits: 2 })} sqft`
        : CELL_FALLBACK
  },
  {
    header: '$/Sqft',
    id: 'pricePerSquareFoot',
    render: (listing, user) =>
      getListingPricePerSquareFoot(listing, user)
        ? `$${getListingPricePerSquareFoot(listing, user)}/Sqft`
        : CELL_FALLBACK
  },
  {
    header: 'Built Year',
    id: 'year',
    render: listing =>
      listing.compact_property.year_built
        ? `${listing.compact_property.year_built}`
        : CELL_FALLBACK
  },
  {
    header: 'Zip Code',
    id: 'zipcode',
    render: listing =>
      listing.address.postal_code
        ? `${listing.address.postal_code}`
        : CELL_FALLBACK
  }
]

export const TableView = ({ listings, mapIsShown, isWidget }: Props) => {
  const classes = useStyles()
  const user = useSelector(selectUserUnsafe)
  const { selections, toggleItem } = useListSelection()
  const [state, dispatch] = useListingsContext()
  const [selectedListingId, setSelectedListingId] =
    useState<Nullable<UUID>>(null)
  const [isListingDetailsModalOpen, setIsListingDetailsModalOpen] =
    useState(false)

  const closeListingDetailsModal = useCallback(() => {
    if (!isWidget) {
      window.history.replaceState({}, '', MLS_BASE_URL)
    }

    setIsListingDetailsModalOpen(false)
    setSelectedListingId(null)
  }, [isWidget])

  const openListingDetailsModal = useCallback(
    (id: UUID) => {
      if (!isWidget) {
        window.history.replaceState({}, '', `${MLS_BASE_URL}/${id}`)
      }

      setIsListingDetailsModalOpen(true)
      setSelectedListingId(id)
    },
    [isWidget]
  )

  const handleChangeHoverState = (listingId: UUID, hover: boolean) => {
    dispatch(changeListingHoverState(hover ? listingId : null))
  }

  const columns = mapIsShown
    ? [...primaryColumns]
    : [...primaryColumns, ...secondaryColumns]

  return (
    <>
      <TableContainer component={Paper}>
        <Table stickyHeader aria-label="listings">
          <TableHead>
            <TableRow>
              <TableCell />
              {columns.map(column => (
                <TableCell variant="head" key={column.id}>
                  {column.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {listings.map(listing => (
              <TableRow
                key={listing.id}
                id={listing.id}
                onMouseEnter={() => handleChangeHoverState(listing.id, true)}
                onMouseLeave={() => handleChangeHoverState(listing.id, false)}
                className={cn(classes.row, {
                  hover: state.listingStates.hover === listing.id,
                  selected: state.listingStates.click === listing.id
                })}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selections.some(
                      (item: ICompactListing) => item.id === listing.id
                    )}
                    onChange={() => toggleItem(listing)}
                    inputProps={{ 'aria-labelledby': listing.id }}
                  />
                </TableCell>
                {columns.map(column => (
                  <TableCell
                    onClick={() => openListingDetailsModal(listing.id)}
                    key={column.id}
                  >
                    {column.render(listing, user)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ListingDetailsModal
        isOpen={isListingDetailsModalOpen}
        listingId={selectedListingId}
        closeHandler={closeListingDetailsModal}
      />
    </>
  )
}
