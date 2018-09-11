import React, { Fragment } from 'react'

import RoleAgentIntegration from '../dashboard/roles/agent-integration'
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
            <button
              onClick={this.showModal}
              className="c-button--shadow add-item"
            >
              <span className="icon test">+</span>
              <span className="text">{ctaTitle}</span>
            </button>
          </div>
        )}

        {this.state.isModalOpen && (
          <RoleAgentIntegration
            user={user}
            onHide={this.closeModal}
            onUpsertRole={onUpsertUser}
            {...rest}
          />
        )}
      </Fragment>
    )
  }
}

export default CrudRole
