import React from 'react'
import _ from 'underscore'
import Section from './section'

export default ({
  tags,
  tasks,
  selectedTask,
  onSelectTask
}) => (
  <div>
    {
      tags && tags
      .filter(tag => tag.is_tab)
      .map(tag =>
        <Section
          key={tag.id}
          section={tag}
          tasks={tasks}
          selectedTask={selectedTask}
          onSelectTask={onSelectTask}
        />
      )
    }
  </div>
)
