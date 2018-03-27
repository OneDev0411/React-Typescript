import React from 'react'
import { connect } from 'react-redux'
import { roleName } from '../../utils/roles'
import UserAvatar from '../../../../../Partials/UserAvatar'

class RecipientGroup extends React.Component {
  render() {
    const {
      group,
      order,
      roles,
      onAddRecipient,
      onRemoveRecipient
    } = this.props

    return (
      <div className="rcp-group">
        <div className="rcp-step">Sining Order {order}</div>

        <div className="rcp-list">
          {_.map(group, (recp, index) => {
            const role = roles[recp.role]
            const { user } = role

            return (
              <span className="recp" key={`RECP_${index}`}>
                <UserAvatar
                  userId={user ? user.id : null}
                  size={30}
                  name={role.legal_full_name}
                  image={user ? user.profile_image_url : null}
                  showStateIndicator={false}
                />
                <span className="recp-title">{role.legal_full_name}</span>
                <span className="recp-description">{roleName(role.role)}</span>
                <span className="recp-cta">
                  <i
                    className="fa fa-times"
                    onClick={() => onRemoveRecipient(role.id)}
                  />
                </span>
              </span>
            )
          })}

          <span onClick={onAddRecipient} className="recp add">
            <span className="recp-title">Add Signer</span>

            <span className="recp-description">
              <i className="fa fa-plus" />
              &nbsp; With signing order {order}
            </span>
          </span>
        </div>
      </div>
    )
  }
}

export default connect(({ deals }) => ({
  roles: deals.roles
}))(RecipientGroup)
