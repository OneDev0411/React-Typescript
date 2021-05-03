import React from 'react'
import { connect } from 'react-redux'

import { mdiCallMerge } from '@mdi/js'

import { GridActionButton } from 'components/Grid/Table/features/Actions/Button'

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
      <GridActionButton
        label="Merge"
        icon={mdiCallMerge}
        onClick={this.onClick}
      />
    )
  }
}

export default connect(null, {
  mergeContact,
  confirmation
})(MergeContacts)
