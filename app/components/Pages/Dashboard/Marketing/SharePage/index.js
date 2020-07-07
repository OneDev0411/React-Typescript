import React from 'react'
import { withRouter } from 'react-router'

import SharedPdf from './SharedPdf'
import SharedImage from './SharedImage'

function Share(props) {
  const fileUrl = props.location.state.file.url
  const fileType = fileUrl.endsWith('.pdf') ? 'pdf' : 'image'

  if (fileType === 'pdf') {
    return <SharedPdf url={fileUrl} />
  }

  return <SharedImage url={fileUrl} />
}

export default withRouter(Share)
