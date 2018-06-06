import React from 'react'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'

import ExportContacts from '../ExportContacts'

Toolbar.propTypes = {
  disabled: PropTypes.bool,
  selectedRows: PropTypes.shape().isRequired,
  totalCount: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired
}

Toolbar.defaultProps = {
  disabled: false
}

export function Toolbar(props) {
  const ids = Object.keys(props.selectedRows)
  const selectedRowsLength = ids.length

  return (
    <Flex full alignCenter>
      <span style={{ fontSize: '1.7rem', marginRight: '1em' }}>
        {selectedRowsLength > 0 ? `${selectedRowsLength} of ` : ''}
        {`${props.totalCount.toLocaleString()} Contacts`}
      </span>
      <ExportContacts
        disabled={props.disabled}
        selectedRows={props.selectedRows}
      />
      {selectedRowsLength > 0 && (
        <div className="list--secondary-button">
          <button
            className="button c-button--shadow"
            onClick={event => props.onDelete(event, ids)}
          >
            Delete
          </button>
        </div>
      )}
    </Flex>
  )
}
