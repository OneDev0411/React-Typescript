import React from 'react'
import Header from './header'
import Comments from './comments'
import Documents from './documents'

export default ({
  task
}) => {

  return (
    <div className="full-width">

      <Header
        task={task || {}}
      />

      <Documents
        task={task}
      />

      <Comments
        task={task}
      />
    </div>
  )
}
