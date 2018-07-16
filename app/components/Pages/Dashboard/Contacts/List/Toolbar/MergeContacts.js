import React from 'react'
import { connect } from 'react-redux'
import { mergeContact } from '../../../../../../store_actions/contacts'

class MergeContacts extends React.Component {
  render() {
    const { selectedRows } = this.props

    return (
      <div className="list--secondary-button">
        {selectedRows.length > 1 && (
          <button
            className="button c-button--shadow"
            onClick={() =>
              this.props.mergeContact(selectedRows[0], selectedRows.slice(1))
            }
          >
            Merge
          </button>
        )}
      </div>
    )
  }
}

export default connect(
  null,
  {
    mergeContact
  }
)(MergeContacts)
