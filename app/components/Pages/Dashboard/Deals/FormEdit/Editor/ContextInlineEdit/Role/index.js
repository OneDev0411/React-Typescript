import React from 'react'
import { connect } from 'react-redux'

import { selectDealRoles } from 'reducers/deals/roles'

export class RolesEdit extends React.Component {
  render() {
    console.log('?????', this.props.roles)

    return <div>------$$$$$------</div>
  }
}

function mapStateToProps({ deals }, props) {
  return {
    roles: selectDealRoles(deals.roles, props.deal)
  }
}

export default connect(mapStateToProps)(RolesEdit)
