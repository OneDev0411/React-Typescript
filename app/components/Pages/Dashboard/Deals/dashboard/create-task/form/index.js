import React from 'react'
import { connect } from 'react-redux'
import { DropdownButton, MenuItem } from 'react-bootstrap'
import _ from 'underscore'

function createTask() {

}

const CreateForm = ({
  activeTag,
  forms,
  type
}) => (
  <div className="creator task-generic">
    <DropdownButton
      id="dropdown-create-form"
      title="Add New Form"
    >
      {
        _.map(forms, form => (
          <MenuItem
            key={`FORM_ITEM_${form.id}`}
            onClick={() => alert(form.id)}
          >
            { form.name }
          </MenuItem>
        ))
      }
    </DropdownButton>
  </div>
)

export default connect(({ deals }) => ({
  forms: deals.forms
}))(CreateForm)
