import React from 'react'
import { withRouter } from 'react-router'

import PageHeader from '../../../../../../views/components/PageHeader'

function Header(props) {
  let backUrl = ''

  if (props.location.query.backurl) {
    backUrl = '/dashboard/contacts'
  }

  return <PageHeader title="Contacts" backUrl={backUrl} />
}

export default withRouter(Header)
