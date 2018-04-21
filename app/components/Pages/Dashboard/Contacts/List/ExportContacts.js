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
        overlay={<Tooltip id="tooltip">Export contacts to a CSV file</Tooltip>}
      >
        <a
          href={`/api/contacts/export/outlook?${idsQuery}`}
          className="button c-button--shadow"
        >
          Export to CSV
        </a>
      </OverlayTrigger>
    </div>
  )
}
