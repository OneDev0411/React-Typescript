import React from 'react'
import { connect } from 'react-redux'
import { addForm } from '../../../../../store_actions/deals'
import { Button } from 'react-bootstrap'
import ListFilter from './ListFilter'
import { compose, withState, pure } from 'recompose'

const enhance = compose(
  pure,
  withState('showListFilter', 'onChangeListFilter', false),
)

const Tasks = ({
                 checklist,
                 forms,
                 showListFilter,
                 onChangeListFilter,
                 addForm
               }) =>
  (
    <div
      className="tasks"
    >
      <div className="tasks-header">
        <div className="label">Allowed forms in this checklist</div>
        <Button
          className="button"
          onClick={() => onChangeListFilter(!showListFilter)}
        >
          Add Form
        </Button>
        {forms && showListFilter &&
        <ListFilter
          showListFilter={showListFilter}
          onChangeListFilter={onChangeListFilter}
          parentClassName="listFilter"
          ulClassName="listFilter-results"
          liClassName="listFilter-results-item"
          inputContainerClassName="listFilter-input-container"
          inputClassName="listFilter-input"
          placeholder="Type in to search…"
          data={forms}
          addForm={(form) => addForm(checklist.brand, checklist.id, form.id)}
        />
        }
      </div>
      {forms && checklist.allowed_forms && checklist.allowed_forms.map(form =>
        <div
          className="task clearfix"
          key={`form_${form}`}
        >
          <p className="task-title">
            {forms[form].name}
          </p>
        </div>
      )}
    </div>
  )
export default connect(({ deals }) => ({
  forms: deals.forms
}),
  ({ addForm })
)(enhance(Tasks))