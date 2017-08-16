import React from 'react'
import FormTask from './form'

export default ({
  dealId,
  listId
}) => {
  return (
    <div className="deal-task-creators">
      <FormTask
        dealId={dealId}
        listId={listId}
      />
    </div>
  )
}
