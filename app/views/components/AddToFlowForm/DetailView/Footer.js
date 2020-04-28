import React from 'react'
import PropTypes from 'prop-types'

import Button from 'components/Button/ActionButton'

Footer.propTypes = {
  disabled: PropTypes.bool.isRequired,
  isAdding: PropTypes.bool.isRequired,
  onAdd: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
}

export default function Footer(props) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Button
        appearance="link"
        disabled={props.disabled}
        onClick={props.onCancel}
        size="small"
        inverse
        style={{ marginRight: '1em' }}
      >
        Cancel
      </Button>
      <Button
        appearance="secondary"
        disabled={props.disabled}
        onClick={props.onAdd}
        size="small"
      >
        {props.isAdding ? 'Adding' : 'Add'}
      </Button>
    </div>
  )
}
