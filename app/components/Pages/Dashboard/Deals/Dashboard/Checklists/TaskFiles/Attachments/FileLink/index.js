import React from 'react'

import { FileLink as Link } from '../../styled'

export default function FileLink(props) {
  if (!props.isBackOffice && props.fileType === 'pdf') {
    return (
      <Link href={props.externalUrl} className="file-link" target="_blank">
        {props.children}
      </Link>
    )
  }

  return (
    <Link to={props.internalUrl} className="file-link">
      {props.children}
    </Link>
  )
}
