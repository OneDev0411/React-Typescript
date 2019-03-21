import React from 'react'
import { connect } from 'react-redux'

import { confirmation } from 'actions/confirmation'

import Button from 'components/Button/ActionButton'

class Delete extends React.Component {
  onClick = () => {
    this.props.dispatch(
      confirmation({
        message: 'Delete contact?',
        description:
          'Deleting this contact will remove it from your contacts list, but it will not be removed from any deals.',
        confirmLabel: 'Delete',
        onConfirm: this.props.handleDelete
      })
    )
  }

  render() {
    if (this.props.isDeleting) {
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 10000,
            color: 'red',
            fontSize: '4rem',
            fontWeight: 'bold',
            opacity: 0.8,
            background: '#ccc'
          }}
        >
          Deleting...
        </div>
      )
    }

    return (
      <Button
        appearance="outline"
        isBlock
        inverse
        onClick={this.onClick}
        style={{ marginBottom: '1em' }}
      >
        Delete Contact
      </Button>
    )
  }
}

export default connect()(Delete)
