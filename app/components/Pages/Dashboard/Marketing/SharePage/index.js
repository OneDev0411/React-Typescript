import React from 'react'
import { withRouter } from 'react-router'

import { goTo } from 'utils/go-to'

import SharedImage from './SharedImage'

function Share(props) {
  const fileUrl = props.location.state.file.url
  const fileType = fileUrl.endsWith('.pdf') ? 'pdf' : 'image'

  if (fileType === 'pdf') {
    return goTo(fileUrl)
  }

  return <SharedImage url={fileUrl} />
}

export default withRouter(Share)
