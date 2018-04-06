import React from 'react'
import { Tooltip, OverlayTrigger } from 'react-bootstrap'

export default ({ selectedRows }) => {
  let idsQuery = ''

  Object.keys(selectedRows).forEach(contctId => {
    idsQuery += `&ids[]=${contctId}`
  })

  return (
    <div className="list--secondary-button">
      <OverlayTrigger
        placement="bottom"
        overlay={<Tooltip id="tooltip">Export to CSV</Tooltip>}
      >
        <a
          href={`/api/export/contacts/outlook.csv?${idsQuery}`}
          className="button c-button--shadow"
        >
          Export Contacts
        </a>
      </OverlayTrigger>
    </div>
  )
}
