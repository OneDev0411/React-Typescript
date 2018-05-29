import React from 'react'
import { Tooltip, OverlayTrigger } from 'react-bootstrap'

export default ({ selectedRows, disabled }) => {
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
          style={{
            opacity: disabled ? 0.7 : 1,
            pointerEvents: disabled ? 'none' : 'initial'
          }}
        >
          Export to CSV
        </a>
      </OverlayTrigger>
    </div>
  )
}
