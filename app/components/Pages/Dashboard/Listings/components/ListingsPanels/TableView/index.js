import React from 'react'
import TableViewRow from './TableViewRow'

const TableView = ({ listings, ...rest }) =>
  <table className="c-tableview__table">
    <tbody>
      {(listings.data.length &&
        listings.data.map(listing =>
          <TableViewRow
            key={`listViewPanel_${listing.id}`}
            listing={listing}
            {...rest}
          />
        )) ||
        ''}
    </tbody>
  </table>

export default TableView
