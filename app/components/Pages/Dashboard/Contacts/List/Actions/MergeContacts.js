import React from 'react'
import { connect } from 'react-redux'

import { ListItem, ListItemText } from '@material-ui/core'

import { ActionWrapper } from '../Table/components/ActionWrapper'
import { mergeContact } from '../../../../../../store_actions/contacts'
import { confirmation } from '../../../../../../store_actions/confirmation'

class MergeContacts extends React.Component {
  onClick = () => {
    const { selectedRows, confirmation } = this.props

    confirmation({
      message: 'Merge contacts?',
      description:
        'The selected contacts will be merged into the 1st contact you selected. Once merged, it can not be undone. Are you sure you want to continue?',
      confirmLabel: 'Yes, merge',
      onConfirm: async () => {
        await this.props.mergeContact(selectedRows[0], selectedRows.slice(1))
        await this.props.submitCallback()
      }
    })
  }

  render() {
    return (
      <ListItem button disabled={this.props.disabled} onClick={this.onClick}>
        <ActionWrapper
          bulkMode={this.props.isEntireMode}
          action="merging"
          atLeast="two"
          disabled={this.props.disabled}
        >
          <ListItemText primary="Merge" />
        </ActionWrapper>
      </ListItem>
    )
  }
}

export default connect(
  null,
  {
    mergeContact,
    confirmation
  }
)(MergeContacts)
