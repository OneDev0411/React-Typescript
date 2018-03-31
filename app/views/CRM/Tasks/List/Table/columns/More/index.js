import React from 'react'
import { string, func } from 'prop-types'
import { Dropdown, MenuItem } from 'react-bootstrap'

import FlexContainer from '../../../../../../components/FlexContainer'
import IconButton from '../../../../../../components/Button/IconButton'
import IconMore from '../../../../../../components/SvgIcons/MoreVert/IconMoreVert'

More.propTypes = {
  id: string.isRequired,
  onDelete: func.isRequired
}

export function More({ id, onDelete }) {
  return (
    <FlexContainer>
      <Dropdown
        pullRight
        id={`table-menu__${id}`}
        className="c-react-table-menu"
      >
        <IconButton
          color="#D7DEE2"
          bsRole="toggle"
          onClick={e => e.stopPropagation()}
        >
          <IconMore />
        </IconButton>

        <Dropdown.Menu bsRole="menu">
          <MenuItem
            eventKey="Delete"
            key={`dropdown__${id}__item_delete`}
            style={{ width: '100%', textAlign: 'left' }}
            onClick={event => onDelete(event, id)}
          >
            Delete
          </MenuItem>
        </Dropdown.Menu>
      </Dropdown>
    </FlexContainer>
  )
}
