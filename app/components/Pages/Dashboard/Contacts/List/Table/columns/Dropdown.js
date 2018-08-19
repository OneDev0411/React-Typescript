import React from 'react'
import { Dropdown, MenuItem } from 'react-bootstrap'

import ShadowButton from '../../../../../../../views/components/Button/ShadowButton'
import VerticalDotsIcon from '../../../../Partials/Svgs/VerticalDots'

const ContactsDropDown = ({ contactId, handleOnDelete }) => (
  <Dropdown
    pullRight
    className="c-react-table-menu"
    id={`contact_${contactId}__dropdown`}
  >
    <ShadowButton
      bsRole="toggle"
      style={{ marginTop: '5px' }}
      onClick={e => e.stopPropagation()}
    >
      <VerticalDotsIcon fill="#D7DEE2" />
    </ShadowButton>

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

export default ContactsDropDown
