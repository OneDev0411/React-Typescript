import React from 'react'
import Header from './header'
import Comments from './comments'
import Files from './files'

export default ({
  task,
  onCloseTask
}) => {

  return (
    <div>

      <Header
        task={task || {}}
        onCloseTask={onCloseTask}
      />

      <Files />

      <Comments
        task={task}
      />
    </div>
  )
}
