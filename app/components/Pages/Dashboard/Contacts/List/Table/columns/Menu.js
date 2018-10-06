import React from 'react'
import { Dropdown, MenuItem } from 'react-bootstrap'

import IconButtonBase from '../../../../../../../views/components/Button/IconButton'
import VerticalDotsIcon from '../../../../../../../views/components/SvgIcons/VeriticalDots/VerticalDotsIcon'
import styled from 'styled-components'
import { grey } from '../../../../../../../views/utils/colors'

const IconButton = styled(IconButtonBase)`
  > svg {
    fill: ${grey.A550};
  }
`

const Menu = ({ contactId, handleOnDelete }) => (
  <Dropdown
    pullRight
    className="c-react-table-menu"
    id={`contact_${contactId}__dropdown`}
  >
    <IconButton
      bsRole="toggle"
      iconSize="large"
      inverse
      isFit
      onClick={e => console.dir(e.target) || e.stopPropagation()}
    >
      <VerticalDotsIcon />
    </IconButton>

    <Dropdown.Menu bsRole="menu">
      <MenuItem
        eventKey="Delete"
        key={`contact_${contactId}__dropdown__item_delete`}
        style={{ width: '100%', textAlign: 'left' }}
        onClick={e =>
          handleOnDelete(e, {
            selectedRows: [contactId]
          })
        }
      >
        Delete
      </MenuItem>
    </Dropdown.Menu>
  </Dropdown>
)

export default Menu
