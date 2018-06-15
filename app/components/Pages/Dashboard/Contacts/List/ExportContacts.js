import React from 'react'
import { Tooltip, OverlayTrigger } from 'react-bootstrap'

export default ({ selectedRows, disabled }) => {
  let url = '/api/contacts/export/outlook'

  if (Array.isArray(selectedRows) && selectedRows.length > 0) {
    url = `${url}?ids[]=${selectedRows.join('&ids[]=')}`
  }

  return (
    <div className="list--secondary-button">
      <OverlayTrigger
        placement="bottom"
        overlay={<Tooltip id="tooltip">Export contacts to a CSV file</Tooltip>}
      >
        <a
          href={url}
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
