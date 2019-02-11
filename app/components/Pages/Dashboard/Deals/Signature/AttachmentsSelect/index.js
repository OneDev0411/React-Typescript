import React from 'react'
import _ from 'underscore'

import Drawer from 'components/OverlayDrawer'

import ActionButton from 'components/Button/ActionButton'

import Documents from './Documents'

export default class AttachmentsSelect extends React.Component {
  state = {
    selectedItems: this.props.defaultSelectedItems || {}
  }

  toggleSelectRow = document => {
    if (!document.checklist) {
      return false
    }

    let newState = {}

    if (this.state.selectedItems[document.id]) {
      newState = _.omit(this.state.selectedItems, row => row.id === document.id)
    } else {
      newState = {
        ...this.state.selectedItems,
        [document.id]: document
      }
    }

    this.setState({ selectedItems: newState })
  }

  handleApply = () =>
    this.props.onChangeSelectedDocuments(this.state.selectedItems)

  getTaskById = id => this.props.tasks.find(task => task.id === id)

  render() {
    const { props } = this

    return (
      <Drawer isOpen onClose={props.onClose}>
        <Drawer.Header title="Select Documents" />
        <Drawer.Body>
          <Documents
            deal={this.props.deal}
            initialAttachments={this.props.initialAttachments}
            selectedItems={this.state.selectedItems}
            onToggleItem={this.toggleSelectRow}
          />
        </Drawer.Body>

        <Drawer.Footer style={{ flexDirection: 'row-reverse' }}>
          <ActionButton
            disabled={_.size(this.state.selectedItems) === 0}
            type="button"
            onClick={this.handleApply}
          >
            Next
          </ActionButton>
        </Drawer.Footer>
      </Drawer>
    )
  }
}
