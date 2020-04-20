import React from 'react'
import { Dropdown } from 'react-bootstrap'

import styled from 'styled-components'

import IconButtonBase from '../../../../../../../views/components/Button/IconButton'
import IconHorizontalDots from '../../../../../../../views/components/SvgIcons/HorizontalDots/IconHorizontalDots'

const IconButton = styled(IconButtonBase)`
  > svg {
    fill: ${props => props.theme.palette.grey['400']};
    &:hover {
      fill: ${props => props.theme.palette.secondary.main};
    }
  }
`
const DeleteAction = styled.span`
  display: block;
  padding: ${props => props.theme.spacing(1)}px;
  color: ${props => props.theme.palette.error.main};
  cursor: pointer;
  &:hover {
    background: ${props => props.theme.palette.grey[200]};
  }
`

const Menu = ({ contactId, handleOnDelete }) => (
  <Dropdown
    pullRight
    className="c-react-table-menu"
    id={`contact_${contactId}__dropdown`}
  >
    <IconButton
      data-test="contact-menu"
      bsRole="toggle"
      iconSize="large"
      inverse
      isFit
      onClick={e => e.stopPropagation()}
    >
      <IconHorizontalDots />
    </IconButton>

    <Dropdown.Menu bsRole="menu">
      <DeleteAction
        eventKey="Delete"
        key={`contact_${contactId}__dropdown__item_delete`}
        onClick={e =>
          handleOnDelete(e, {
            singleSelectedRow: [contactId]
          })
        }
      >
        Delete
      </DeleteAction>
    </Dropdown.Menu>
  </Dropdown>
)

export default Menu
