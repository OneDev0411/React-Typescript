import React from 'react'
import { connect } from 'react-redux'
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
      onConfirm: () =>
        this.props.mergeContact(selectedRows[0], selectedRows.slice(1))
    })
  }
  render() {
    const { selectedRows } = this.props

    if (selectedRows.length < 2) {
      return null
    }

    return (
      <div className="list--secondary-button">
        <button className="button c-button--shadow" onClick={this.onClick}>
          Merge
        </button>
      </div>
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
