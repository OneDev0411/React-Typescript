import React from 'react'
import TableViewRow from './TableViewRow'

const TableView = ({ listings, ...rest }) =>
  <table className="c-tableview__table">
    <tbody>
      {(listings.data.length &&
        listings.data.map((listing, index) =>
          <TableViewRow
            {...rest}
            listing={listing}
            key={`${rest.activePanel}_PANEL_LIST_ITEM_${index}`}
          />
        )) ||
        ''}
    </tbody>
  </table>

export default TableView
