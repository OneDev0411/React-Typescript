import React, { component } from 'react'
import { connect } from 'react-redux'
import Members from '../Compose'
import { getRoles } from '../../../../../store_actions/brandConsole'

class Column extends component {

  componentDidMount() {
    this.init(this.props.user)
  }

  async init(user) {
    this.props.getRoles(user)
  }

  render() {
    return (
      <div className="column">
        <div className='title'>
          {role.role}
        </div>
        <div className="members">
          <Members
            room={role}
            iconSize={14}
          />
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
)(Column)