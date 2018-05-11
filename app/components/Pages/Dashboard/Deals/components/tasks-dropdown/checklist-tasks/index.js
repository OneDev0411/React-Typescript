import React from 'react'
import { ChecklistItem } from '../checklist-item'

export const Tasks = ({
  tasks,
  checklist,
  filterValue,
  onSelectItem,
  selectedTask,
  showNotifyOption,
  selectedNotifyOffice,
  onChangeNotifyOffice
}) => (
  <div>
    {checklist.tasks &&
      checklist.tasks
        .filter(id =>
          tasks[id].title
            .toLowerCase()
            .includes((filterValue || '').toLowerCase())
        )
        .map(id => (
          <ChecklistItem
            key={id}
            id={id}
            checklist={checklist}
            title={tasks[id].title}
            selectedItem={selectedTask && selectedTask.id}
            onSelect={onSelectItem}
            showNotifyOption={showNotifyOption}
            selectedNotifyOffice={selectedNotifyOffice}
            onChangeNotifyOffice={onChangeNotifyOffice}
          />
        ))}
  </div>
)
