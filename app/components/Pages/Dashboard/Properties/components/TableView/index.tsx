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

import { selectUserUnsafe } from '@app/selectors/user'
import { noop } from '@app/utils/helpers'
import {
  metersToFeet,
  addressTitle,
  getListingFormatedPrice,
  getListingPricePerSquareFoot
} from '@app/utils/listing'
import { ListingDetailsModal } from '@app/views/components/ListingDetailsModal'
import { useListSelection } from '@app/views/components/ListSelection/use-list-selection'

import { IListingUIStates } from '../../types'

const useStyles = makeStyles(
  () => ({
    row: {
      '&.hover, &.selected': {
        backgroundColor: '#eee',
        cursor: 'pointer'
      }
    },
    isScroling: {
      pointerEvents: 'none'
    }
  }),
  { name: 'ListingsTable' }
)

interface Props {
  listings: ICompactListing[]
  mapIsShown: boolean
  isWidget: boolean
  listingStates: IListingUIStates
  isScroling?: boolean
  onChangeHoverState?: (id: UUID, hover: boolean) => void
  onToggleLike?: (id: UUID) => void
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
      `$${getListingFormatedPrice(
        listing.price,
        listing.close_price,
        user,
        false
      )}`
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

export const TableView = ({
  listings,
  mapIsShown,
  isWidget,
  listingStates,
  isScroling = false,
  onChangeHoverState = noop,
  onToggleLike = noop
}: Props) => {
  const classes = useStyles()
  const user = useSelector(selectUserUnsafe)
  const { selections, toggleItem } = useListSelection()
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

  const onToggleFavorite = useCallback(() => {
    if (selectedListingId) {
      onToggleLike(selectedListingId)
    }
  }, [onToggleLike, selectedListingId])

  const handleToggleSelection = useCallback(toggleItem, [toggleItem])

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
                onMouseEnter={() => onChangeHoverState(listing.id, true)}
                onMouseLeave={() => onChangeHoverState(listing.id, false)}
                className={cn(classes.row, {
                  hover: listingStates.hover === listing.id,
                  selected: listingStates.click === listing.id,
                  [classes.isScroling]: isScroling
                })}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selections.some(
                      (item: ICompactListing) => item.id === listing.id
                    )}
                    onChange={() => handleToggleSelection(listing)}
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
        onToggleFavorite={onToggleFavorite}
        closeHandler={closeListingDetailsModal}
      />
    </>
  )
}
