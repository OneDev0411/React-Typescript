import React from 'react'
import { Row, Col } from 'react-bootstrap'
import { connect } from 'react-redux'
import UserAvatar from '../../../../../Partials/UserAvatar'
import AddRole from './add-role'

class Roles extends React.Component {
  constructor(props) {
    super(props)
  }

  onClick(item) {
    const { onSelectRole } = this.props

    if (onSelectRole) {
      onSelectRole({
        first_name: item.user.first_name,
        last_name: item.user.last_name,
        email: item.user.email,
        role: item.role
      })
    }
  }

  render() {
    const { deal, onSelectRole } = this.props
    const { roles } = deal

    return (
      <div className="deal-roles">
        {
          roles &&
          roles.map(item =>
            <div
              key={item.id}
              className="item"
              style={{ cursor: onSelectRole ? 'pointer': 'auto' }}
              onClick={() => this.onClick(item)}
            >
              <div className="role-avatar">
                <UserAvatar
                  name={item.user.display_name}
                  image={item.user.profile_image_thumbnail_url}
                  size={40}
                  showStateIndicator={false}
                />
              </div>

              <div className="name">
                <div>{ item.user.display_name }</div>
                <div className="role">{ item.role }</div>
              </div>
            </div>
          )
        }

        <AddRole
          dealId={deal.id}
        />
      </div>
    )
  }
}

export default connect(null)(Roles)
