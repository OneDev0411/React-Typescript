import React from 'react'
import _ from 'underscore'

import { ChecklistItem } from '../ChecklistItem'

export const Forms = ({
  tasks,
  checklist,
  filterValue,
  onSelectItem,
  showNotifyOption,
  shouldNotifyOffice,
  onChangeNotifyOffice
}) => (
  <div>
    {_.chain(checklist.allowed_forms)
      .filter(form => {
        const isFormExists = _.find(
          checklist.tasks,
          id => tasks[id].form === form.id
        )

        return (
          typeof isFormExists === 'undefined' &&
          form.name.toLowerCase().includes((filterValue || '').toLowerCase())
        )
      })
      .map(form => (
        <ChecklistItem
          key={form.id}
          id={form.id}
          checklist={checklist}
          title={form.name}
          onSelect={onSelectItem.bind(null, form, checklist.id)}
          showNotifyOption={showNotifyOption}
          shouldNotifyOffice={shouldNotifyOffice}
          onChangeNotifyOffice={onChangeNotifyOffice}
        />
      ))
      .value()}
  </div>
)
