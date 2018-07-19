import React, { Fragment } from 'react'
import FileDocument from './file-document'
import SubmissionDocument from './submission-document'

const Documents = props => {
  const { submission, room } = props.task
  const { attachments } = room

  return (
    <Fragment>
      {submission && <SubmissionDocument submission={submission} {...props} />}

      {attachments &&
        attachments
          .filter(file => file.mime === 'application/pdf')
          .map(file => <FileDocument key={file.id} file={file} {...props} />)}
    </Fragment>
  )
}

export default Documents
