import React from 'react'
import styled from 'styled-components'
import { Tooltip, OverlayTrigger } from 'react-bootstrap'
import ActionButton from '../../../../../../views/components/Button/ActionButton'

const Link = styled.a`
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  pointerevents: ${props => (props.disabled ? 'none' : 'initial')};
  text-decoration: none !important;

  :hover {
    color: #fff !important;
  }
`

const Button = ActionButton.extend`
  opacity: ${props => (props.disabled ? 0.7 : 1)};

  :hover,
  :hover a {
    color: #fff !important;
  }
`

export default ({ exportIds, disabled, filters }) => {
  let url = '/api/contacts/export/outlook'

  if (Array.isArray(exportIds) && exportIds.length > 0) {
    url = `${url}?ids[]=${exportIds.join('&ids[]=')}`
  } else if (filters && typeof filters === 'object') {
    url = `${url}?filters[]=${filters
      .map(filter => encodeURIComponent(JSON.stringify(filter)))
      .join('&filters[]=')}`
  }

  if (disabled) {
    url = '#'
  }

  return (
    <OverlayTrigger
      placement="bottom"
      overlay={<Tooltip id="tooltip">Export contacts to a CSV file</Tooltip>}
    >
      <Button inverse disabled={disabled} style={{ padding: '0.70em 1.5em' }}>
        <Link href={url} disabled={disabled}>
          Export to CSV
        </Link>
      </Button>
    </OverlayTrigger>
  )
}
