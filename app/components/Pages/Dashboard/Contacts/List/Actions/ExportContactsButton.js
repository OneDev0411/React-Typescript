import React from 'react'
import { Tooltip, OverlayTrigger } from 'react-bootstrap'
import LinkButton from '../../../../../../views/components/Button/LinkButton'

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
    <OverlayTrigger
      placement="bottom"
      overlay={<Tooltip id="tooltip">Export contacts to a CSV file</Tooltip>}
    >
      <LinkButton appearance="outline" disabled={disabled} to={url}>
        Export to CSV
      </LinkButton>
    </OverlayTrigger>
  )
}
