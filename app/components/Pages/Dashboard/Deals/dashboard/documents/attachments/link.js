import React from 'react'
import { Link } from 'react-router'

import { isBackOffice } from '../../../../../../../utils/user-teams'

import { connect } from 'react-redux'

const FileLink = ({
  fileType,
  internalUrl,
  externalUrl,
  children,
  isBackOffice
}) => {
  if (!isBackOffice && fileType === 'pdf') {
    return (
      <a className="item attachment" href={externalUrl} target="_blank">
        {children}
      </a>
    )
  }

  return (
    <Link
      className="item attachment"
      style={{ cursor: 'pointer' }}
      to={internalUrl}
    >
      {children}
    </Link>
  )
}

function mapStateToProps({ user }) {
  return {
    isBackOffice: isBackOffice(user)
  }
}

export default connect(mapStateToProps)(FileLink)
