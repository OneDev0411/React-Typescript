import React from 'react'
import _ from 'underscore'
import Section from './section'

export default ({
  dealId,
  checklists,
  selectedTask,
  onSelectTask
}) => (
  <div>
    {
      checklists && checklists
      .map(list =>
        <Section
          key={list.id}
          dealId={dealId}
          section={list}
          tasks={list.tasks}
          selectedTask={selectedTask}
          onSelectTask={onSelectTask}
        />
      )
    }
  </div>
)
