import React from 'react'
import { connect } from 'react-redux'
import AgentTable from './agent'
import BackOfficeTable from './backoffice'

const List = ({ isBackOffice, ...rest }) =>
  isBackOffice ? <BackOfficeTable {...rest} /> : <AgentTable {...rest} />

function mapStateToProps({ deals }) {
  return {
    isBackOffice: deals.backoffice
  }
}

export default connect(mapStateToProps)(List)
