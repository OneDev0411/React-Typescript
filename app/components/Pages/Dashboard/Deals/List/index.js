import React from 'react'
import { connect } from 'react-redux'
import AgentTable from './Agent'
import BackOfficeTable from './BackOffice'
import { isBackOffice } from '../../../../../utils/user-teams'
import { isTrainingAccount } from '../../../../../utils/user-teams'

const List = ({ isBackOffice, ...rest }) =>
  isBackOffice ? <BackOfficeTable {...rest} /> : <AgentTable {...rest} />

function mapStateToProps({ user }) {
  return {
    isTrainingAccount: isTrainingAccount(user),
    isBackOffice: isBackOffice(user)
  }
}

export default connect(mapStateToProps)(List)
