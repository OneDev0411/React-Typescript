import React from 'react'
import { Dropdown, MenuItem } from 'react-bootstrap'

export default ({
  form,
  onChange
}) => (
  <div className="role-title">
    <label>Title</label>
    <div>
      <Dropdown id="deal-add-role-title--drp" bsStyle="default">
        <Dropdown.Toggle>
          {form.legal_prefix || 'Select a Title'}
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
    </div>
  </div>
)

