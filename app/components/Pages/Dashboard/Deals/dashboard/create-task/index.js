import React from 'react'

const tasks = {
  Form    : 'form',
  Generic : 'generic'
}

export default ({
  tags,
  activeTag
}) => {
  const tag = tags.find(tag => tag.id === activeTag)
  const { allowed_tasks } = tag

  return (
    <div className="deal-task-creators">
      {
        allowed_tasks.map(type => {
          const TaskCreator = require('./' + tasks[type]).default

          /* *
           * Normalize key based on type because:
           * React will determine whether it is the same component or not based on key
           */
          const key = type.replace(/\s/g, '')

          return <TaskCreator
            key={`TSK_${key}`}
            type={type}
            activeTag={activeTag}
          />
        })
      }
    </div>
  )
}
