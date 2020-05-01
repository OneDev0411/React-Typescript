import React from 'react'

import { Button } from '@material-ui/core'

import AddIcon from 'components/SvgIcons/Add/AddIcon'

import { RoleAgentIntegration } from '../components/Roles/AgentIntegration'
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
      <>
        {user ? (
          <RoleItem
            user={user}
            onRemove={onRemoveUser}
            onClick={this.showModal}
          />
        ) : (
          <div className="entity-item people new">
            <Button
              color="secondary"
              onClick={this.showModal}
              className="add-item"
            >
              <AddIcon className="addIcon" />
              <span className="text">{ctaTitle}</span>
            </Button>
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
      </>
    )
  }
}

export default CrudRole
