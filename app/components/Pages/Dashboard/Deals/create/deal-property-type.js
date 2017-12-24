import React from 'react'
import { Dropdown, MenuItem } from 'react-bootstrap'
import RadioButton from '../components/radio'

const properties = [
  'Resale',
  'Residential Lease',
  'New Home',
  'Lot / Land',
  'Commercial Sale',
  'Commercial Lease'
]

export default ({
  selectedType,
  onChangeDealType
}) => (
  <div className="form-section deal-type">
    <div className="hero">
      What is the checklist type? <span className="required">*</span>
    </div>

    <Dropdown id="deal-create-type-dropdown">
      <Dropdown.Toggle className="deal-type-dropdown">
        { selectedType || 'Choose a type' }
      </Dropdown.Toggle>

      <Dropdown.Menu className="deal-type-dropdown-list">
        {
          properties.map((item, key) =>
            <MenuItem
              key={`MENU_ITEM_${key}`}
              onClick={() => onChangeDealType(item)}
              eventKey={key + 1}
            >
              <RadioButton
                selected={selectedType === item}
                title={item}
              />
            </MenuItem>
          )
        }
      </Dropdown.Menu>
    </Dropdown>
  </div>
)
