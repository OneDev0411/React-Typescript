import React from 'react'
import Upload from '../../upload'
import FileAttachments from './files'

export default ({
  deal,
  task
}) => {

  if (!task) {
    return null
  }

  const attachments = task.room.attachments || []
  const hasAttachments = attachments.length > 0

  return (
    <div className="file">
      <div className="title">
        Uploads
      </div>

      {
        hasAttachments &&
        <div className="file-group">
          <FileAttachments
            deal={deal}
            task={task}
            attachments={attachments}
          />
        </div>
      }

      <Upload
        deal={deal}
        task={task}
        hasAttachments={hasAttachments}
        noDrop={true}
      />
    </div>
  )
}
