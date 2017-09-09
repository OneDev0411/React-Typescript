import React from 'react'
import FormTask from './form'

export default ({
  dealId,
  listId
}) => {
  return (
    <div className="task add-task">
      <FormTask
        dealId={dealId}
        listId={listId}
      />
    </div>
  )
}
