import React from 'react'

import { withRouter } from 'react-router'

import { getFileType } from 'utils/file-utils/get-file-type'

import SharedMedia from './SharedMedia'

function Share(props) {
  const fileUrl = props.location.state.file.url
  const fileType = getFileType(props.location.state.file)

  if (fileType === 'pdf') {
    return window.location.replace(fileUrl)
  }

  return <SharedMedia url={fileUrl} fileType={fileType} />
}

export default withRouter(Share)
