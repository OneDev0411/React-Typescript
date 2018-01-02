import React from 'react'
import { Dropdown, MenuItem } from 'react-bootstrap'
import roleNames from '../../../utils/roles'

export default ({
  form,
  role_names,
  isAllowed,
  onChange
}) => (
  <Dropdown id="deal-add-role--drp">
    <Dropdown.Toggle>
      {form.role ? roleNames(form.role) : 'Select a Role *'}
    </Dropdown.Toggle>

    <Dropdown.Menu className="deal-add-role--drpmenu u-scrollbar--thinner--self">
      {
        role_names
          .sort(name => isAllowed(name) ? -1 : 1)
          .map((name, key) => {
            if (!isAllowed(name)) {
              return (
                <li key={key} className="disabled">
                  <a href="#" onClick={e => e.preventDefault()}>{name}</a>
                </li>
              )
            }

            return (
              <MenuItem
                key={`ROLE_${name}`}
                onClick={() => onChange(name)}
              >
                {roleNames(name)}
              </MenuItem>
            )
          })
      }
    </Dropdown.Menu>
  </Dropdown>
)
