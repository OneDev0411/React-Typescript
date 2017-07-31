import React from 'react'
import Header from './header'
import Comments from './comments'
import Files from './files'

export default ({
  task
}) => {

  return (
    <div className="full-width">

      <Header
        task={task || {}}
      />

      <Files />

      <Comments
        task={task}
      />
    </div>
  )
}
