import React from 'react'

import { ChecklistItem } from '../ChecklistItem'

export const Tasks = ({
  tasks,
  checklist,
  filterValue,
  onSelectItem,
  selectedTask,
  showNotifyOption,
  shouldNotifyOffice,
  onChangeNotifyOffice
}) => (
  <div>
    {tasks
      .filter(
        task =>
          ['Media', 'Splitter'].includes(task.task_type) === false &&
          task.title.toLowerCase().includes((filterValue || '').toLowerCase())
      )
      .map((task, index) => (
        <ChecklistItem
          key={index}
          id={task.id}
          checklist={checklist}
          title={task.title}
          selectedItem={selectedTask && selectedTask.id}
          onSelect={onSelectItem}
          showNotifyOption={showNotifyOption}
          shouldNotifyOffice={shouldNotifyOffice}
          onChangeNotifyOffice={onChangeNotifyOffice}
        />
      ))}
  </div>
)
