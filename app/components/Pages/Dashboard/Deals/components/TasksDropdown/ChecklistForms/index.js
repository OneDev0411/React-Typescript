import React from 'react'
import { connect } from 'react-redux'

import _ from 'underscore'

import { selectFormsByBrand } from 'reducers/deals/forms'

import { ChecklistItem } from '../ChecklistItem'

const Forms = ({
  forms,
  tasks,
  checklist,
  filterValue,
  onSelectItem,
  showNotifyOption,
  shouldNotifyOffice,
  onChangeNotifyOffice
}) => (
  <div>
    {forms &&
      Object.values(forms)
        .filter(form => {
          const isFormExists = tasks.find(task => task.form === form.id)

          return (
            !isFormExists &&
            form.name.toLowerCase().includes((filterValue || '').toLowerCase())
          )
        })
        .map((form, index) => (
          <ChecklistItem
            key={index}
            id={form.id}
            checklist={checklist}
            title={form.name}
            onSelect={onSelectItem.bind(null, form, checklist.id)}
            showNotifyOption={showNotifyOption}
            shouldNotifyOffice={shouldNotifyOffice}
            onChangeNotifyOffice={onChangeNotifyOffice}
          />
        ))}
  </div>
)

function mapStateToProps({ deals }, ownProps) {
  return {
    forms: selectFormsByBrand(deals.forms, ownProps.deal.brand.id)
  }
}

export default connect(mapStateToProps)(Forms)
