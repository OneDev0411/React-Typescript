import React, { Fragment } from 'react'

import ActionButton from 'components/Button/ActionButton'

import RoleAgentIntegration from '../components/Roles/AgentIntegration'
import RoleItem from './role-item'

class CrudRole extends React.Component {
  state = {
    isModalOpen: false
  }

  closeModal = () =>
    this.setState({
      isModalOpen: false
    })

  showModal = () =>
    this.setState({
      isModalOpen: true
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

        {this.state.isModalOpen && (
          <RoleAgentIntegration
            role={user}
            onHide={this.closeModal}
            onUpsertRole={onUpsertUser}
            roleFormOptions={{}}
            {...rest}
          />
        )}
      </Fragment>
    )
  }
}

export default CrudRole
