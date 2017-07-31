import React from 'react'
import FormTask from './form'

export default ({
  dealId,
  tagId
}) => {
  return (
    <div className="deal-task-creators">
      <FormTask
        dealId={dealId}
        tagId={tagId}
      />
    </div>
  )
}
