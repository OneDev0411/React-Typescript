import React, { Fragment } from 'react'

import RoleAgentIntegration from '../components/Roles/AgentIntegration'
import RoleItem from './role-item'
import ActionButton from 'components/Button/ActionButton'

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
              className=" add-item"
            >
              <span className="icon test">+</span>
              <span className="text">{ctaTitle}</span>
            </ActionButton>
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
