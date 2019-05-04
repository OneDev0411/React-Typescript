import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import { deleteRole } from 'actions/deals'
import { confirmation } from 'actions/confirmation'

import IconButton from 'components/Button/IconButton'
import TrashIcon from 'components/SvgIcons/TrashIcon'
import Spinner from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'

DeleteRole.propTypes = {
  role: PropTypes.object.isRequired,
  deal: PropTypes.object.isRequired,
  style: PropTypes.object,
  buttonStyle: PropTypes.object,
  onDeleteRole: PropTypes.func
}

DeleteRole.defaultProps = {
  onDeleteRole: () => null,
  style: {},
  buttonStyle: {}
}

function DeleteRole(props) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleRemoveRole = useCallback(() => {
    props.confirmation({
      message: `Remove <b>${props.role.legal_first_name} ${
        props.role.legal_last_name
      }</b>?`,
      confirmLabel: 'Yes, remove contact',
      onConfirm: async () => {
        try {
          setIsDeleting(true)
          await props.deleteRole(props.deal.id, props.role.id)
          props.onDeleteRole(props.role)
        } catch (e) {
          props.notify({
            message:
              'Can not remove the contact from this deal, please try again',
            status: 'error'
          })
        } finally {
          setIsDeleting(false)
        }
      }
    })
  }, [props])

  if (isDeleting) {
    return <Spinner />
  }

  return (
    <IconButton
      appearance="icon"
      inverse
      onClick={handleRemoveRole}
      style={props.style}
      {...props.buttonProps}
    >
      <TrashIcon />
    </IconButton>
  )
}

export default connect(
  null,
  {
    notify,
    deleteRole,
    confirmation
  }
)(DeleteRole)
