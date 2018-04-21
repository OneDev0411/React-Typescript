import React from 'react'
import { Dropdown, MenuItem } from 'react-bootstrap'
import { roleName } from '../../../utils/roles'

function Role({ form, role_names, isAllowed, onChange }) {
  return (
    <div>
      <label>
        Select Role <sup>*</sup>
      </label>
      <div>
        <Dropdown id="deal-add-role--drp">
          <Dropdown.Toggle>
            {form.role ? roleName(form.role) : 'Select a Role'}
          </Dropdown.Toggle>

          <Dropdown.Menu className="deal-add-role--drpmenu u-scrollbar--thinner--self">
            {role_names
              .sort(name => (isAllowed(name) ? -1 : 1))
              .map((name, key) => {
                if (!isAllowed(name)) {
                  return (
                    <li key={key} className="disabled">
                      <a href="#" onClick={e => e.preventDefault()}>
                        {name}
                      </a>
                    </li>
                  )
                }

                return (
                  <MenuItem key={`ROLE_${name}`} onClick={() => onChange(name)}>
                    {roleName(name)}
                  </MenuItem>
                )
              })}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  )
}

export default Role
