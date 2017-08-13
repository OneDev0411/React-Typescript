import React from 'react'
import { connect } from 'react-redux'
import Header from './Header'
import Column from './Column'
import { getRoles } from '../../../../../store_actions/brandConsole'

class Roles extends React.Component {
  componentDidMount() {
    this.props.getRoles(this.props.user)
  }

  render() {
    const roles = this.props.roles
    return (
      <div className="roles">
        <Header
          role={this.props.user}
        />
        <div className="rows">
          {roles.map(role =>
            <Column
              key={`ROLE_${role.id}`}
              role={role}
            />
          )}
        </div>
      </div>
    )
  }
}

export default connect(
  ({ brandConsole, data }) => ({
    roles: brandConsole.roles || [],
    user: data.user
  }),
  ({ getRoles })
)(Roles)
