import React from 'react'
import { Tooltip, OverlayTrigger } from 'react-bootstrap'

export default ({ exportIds, disabled, filters }) => {
  let url = '/api/contacts/export/outlook'

  if (Array.isArray(exportIds) && exportIds.length > 0) {
    url = `${url}?ids[]=${exportIds.join('&ids[]=')}`
  } else if (filters && typeof filters === 'object') {
    url = `${url}?filters[]=${filters
      .map(filter => encodeURIComponent(JSON.stringify(filter)))
      .join('&filters[]=')}`
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
