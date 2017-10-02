import React from 'react'
import UploadFile from './upload'
import FileAttachments from './files'

export default ({
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
            task={task}
            attachments={attachments}
          />
        </div>
      }

      <UploadFile
        task={task}
        hasAttachments={hasAttachments}
      />
    </div>
  )
}
