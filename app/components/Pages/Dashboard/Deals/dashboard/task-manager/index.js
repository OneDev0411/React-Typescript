import React from 'react'
import Header from './header'
import Comments from './comments'
import Files from './files'

export default ({
  task,
  onCloseTask
}) => {

  return (
    <div className="full-width">

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
