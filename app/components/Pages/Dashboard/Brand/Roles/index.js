import React from 'react'
import { connect } from 'react-redux'
import Header from './Header'
import Column from './Column'
import { getRoles } from '../../../../../store_actions/brandConsole'

class Roles extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeRole: null
    }
    this.onSelectRole = this.onSelectRole.bind(this)
  }

  componentDidMount() {
    this.props.getRoles(this.props.user)
  }

  onSelectRole(activeRole) {
    this.setState({ activeRole })
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
              onSelectRole={this.onSelectRole}
              activeRole={this.state.activeRole === role.id}
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
