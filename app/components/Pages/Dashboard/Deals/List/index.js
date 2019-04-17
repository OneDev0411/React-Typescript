import React from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'

import AgentTable from './Agent'
import BackOfficeTable from './BackOffice'
import { isBackOffice } from '../../../../../utils/user-teams'

const List = ({ isBackOffice, ...rest }) => (
  <React.Fragment>
    <Helmet>
      <title>Deals | Rechat</title>
    </Helmet>

    {isBackOffice ? <BackOfficeTable {...rest} /> : <AgentTable {...rest} />}
  </React.Fragment>
)

function mapStateToProps({ user }) {
  return {
    isBackOffice: isBackOffice(user)
  }
}

export default connect(mapStateToProps)(List)
