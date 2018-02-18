import React from 'react'
import Form from './digital-form'
import Attachments from './attachments'
import Envelopes from './esigns'
import DragAndDrop from '../../../Partials/Svgs/DragAndDrop'

export default ({ deal, task }) => (
  <div className="deal-files-container">
    <Form deal={deal} task={task} />

    <Envelopes deal={deal} task={task} />

    <Attachments deal={deal} task={task} />
    <div className="drag-drop-container">
      <DragAndDrop />
    </div>
  </div>
)
