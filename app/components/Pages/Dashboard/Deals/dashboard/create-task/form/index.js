import React from 'react'
import { connect } from 'react-redux'
import { DropdownButton, MenuItem } from 'react-bootstrap'
import _ from 'underscore'
import { createTask } from '../../../../../../../store_actions/deals'

const createNewTask = (form, props) => {
  const { dealId, createTask, listId } = props

  createTask(dealId, form.id, form.name, 'Incomplete', 'Form', listId)
}

const CreateForm = (props) => {
  const { forms } = props

  return (
    <div className="creator task-form">
      <DropdownButton
        noCaret
        className="add-task"
        id="dropdown-create-form"
        title="+ Add New"
      >
        {
          _.map(forms, form => (
            <MenuItem
              key={`FORM_ITEM_${form.id}`}
              onClick={() => createNewTask(form, props)}
            >
              { form.name }
            </MenuItem>
          ))
        }
      </DropdownButton>
    </div>
  )
}

export default connect(({ deals }) => ({
  forms: deals.forms
}), { createTask })(CreateForm)
