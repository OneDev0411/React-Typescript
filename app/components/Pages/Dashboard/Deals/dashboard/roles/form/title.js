import React from 'react'
import { Dropdown, MenuItem } from 'react-bootstrap'

export default ({
  form,
  onChange
}) => (
  <Dropdown id="deal-add-role-title--drp" bsStyle="default">
    <Dropdown.Toggle>
      {form.legal_prefix || 'Title'}
    </Dropdown.Toggle>

    <Dropdown.Menu className="deal-add-role-title--drpmenu">
      {
        ['Mr', 'Mrs', 'Miss', 'Ms', 'Dr']
        .map((name, key) =>
          <MenuItem
            key={`Title_${key}`}
            style={{ width: '40%' }}
            onClick={() => onChange(name)}
          >
            {name}
          </MenuItem>
        )
      }
    </Dropdown.Menu>
  </Dropdown>
)

