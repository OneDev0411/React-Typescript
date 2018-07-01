import React from 'react'
import { connect } from 'react-redux'
import AgentTable from './agent'
import BackOfficeTable from './backoffice'
import { isBackOffice } from '../../../../../utils/user-teams'

const List = ({ isBackOffice, ...rest }) =>
  isBackOffice ? <BackOfficeTable {...rest} /> : <AgentTable {...rest} />

function mapStateToProps({ user }) {
  return {
    isBackOffice: isBackOffice(user)
  }
}

export default connect(mapStateToProps)(List)
