import React, { Fragment } from 'react'

import ActionButton from 'components/Button/ActionButton'

import RoleAgentIntegration from '../components/Roles/AgentIntegration'
import RoleItem from './role-item'

class CrudRole extends React.Component {
  state = {
    isDrawerOpen: false
  }

  closeModal = () =>
    this.setState({
      isDrawerOpen: false
    })

  showModal = () =>
    this.setState({
      isDrawerOpen: true
    })

  render() {
    const { user, ctaTitle, onRemoveUser, onUpsertUser, ...rest } = this.props

    return (
      <Fragment>
        {user ? (
          <RoleItem
            user={user}
            onRemove={onRemoveUser}
            onClick={this.showModal}
          />
        ) : (
          <div className="entity-item people new">
            <ActionButton
              appearance="link"
              onClick={this.showModal}
              className="add-item"
            >
              <span className="icon test">+</span>
              <span className="text">{ctaTitle}</span>
            </ActionButton>
          </div>
        )}

        {this.state.isDrawerOpen && (
          <RoleAgentIntegration
            role={user}
            onClose={this.closeModal}
            onUpsertRole={onUpsertUser}
            showRoleOverlay={false}
            {...rest}
          />
        )}
      </Fragment>
    )
  }
}

export default CrudRole
