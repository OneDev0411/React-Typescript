import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  makeStyles
} from '@material-ui/core'
import cn from 'classnames'
import numeral from 'numeral'

import { toggleListingHoverState } from '../context/actions'
import useListingsContext from '../hooks/useListingsContext'

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

export const TableView = ({ listings, mapIsShown }) => {
  const classes = useStyles()
  const [, dispatch] = useListingsContext()

  const toggleHoverState = listingId => {
    dispatch(toggleListingHoverState(listingId))
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="listings">
        <TableHead>
          <TableRow>
            <TableCell>Address</TableCell>
            <TableCell>Price</TableCell>
            {/* // TODO: add other columns */}
            {!mapIsShown && <TableCell>Other</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {listings.map(listing => (
            <TableRow
              key={listing.id}
              id={listing.id}
              onMouseEnter={() => toggleHoverState(listing.id)}
              onMouseLeave={() => toggleHoverState(listing.id)}
              className={cn(classes.row, {
                hover: listing.hover,
                selected: listing.clicked
              })}
            >
              <TableCell>{listing.address.street_address}</TableCell>
              <TableCell>{numeral(listing.price).format('0.[00]a')}</TableCell>
              {/* // TODO: add other columns */}
              {!mapIsShown && <TableCell>Other</TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
