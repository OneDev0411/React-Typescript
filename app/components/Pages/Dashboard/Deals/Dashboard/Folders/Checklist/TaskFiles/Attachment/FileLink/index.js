import React from 'react'
import { connect } from 'react-redux'

import { selectDealEnvelopes } from 'reducers/deals/envelopes'

import { getDocumentEnvelopes } from '../../../../../../utils/get-document-envelopes'

import { FileLink as Link } from '../../styled'

function getFileType(file) {
  if (file.mime === 'application/pdf') {
    return 'pdf'
  }

  if (file.mime.includes('image/')) {
    return 'image'
  }

  return 'unknown'
}

function FileLink(props) {
  const envelopes = getDocumentEnvelopes(props.envelopes, props.file)

  if (
    props.isBackOffice === false &&
    getFileType(props.file) === 'pdf' &&
    envelopes.length === 0
  ) {
    return (
      <Link href={props.file.url} className="file-link" target="_blank">
        {props.children}
      </Link>
    )
  }

  const link =
    envelopes.length > 0
      ? `envelope/${envelopes[0].id}`
      : `attachment/${props.file.id}`

  return (
    <Link
      className="file-link"
      to={`/dashboard/deals/${props.deal.id}/view/${props.taskId}/${link}`}
    >
      {props.children}
    </Link>
  )
}

function mapStateToProps({ deals }, props) {
  return {
    envelopes: selectDealEnvelopes(props.deal, deals.envelopes)
  }
}

export default connect(mapStateToProps)(FileLink)
