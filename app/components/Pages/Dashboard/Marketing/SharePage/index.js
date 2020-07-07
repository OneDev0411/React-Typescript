import React from 'react'
import { withRouter } from 'react-router'

import { goTo } from 'utils/go-to'

import { getFileType } from 'utils/file-utils/get-file-type'

import SharedImage from './SharedImage'

function Share(props) {
  const fileUrl = props.location.state.file.url
  const fileType = getFileType(props.location.state.file)

  if (fileType === 'pdf') {
    return goTo(fileUrl)
  }

  return <SharedImage url={fileUrl} />
}

export default withRouter(Share)
