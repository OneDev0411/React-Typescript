import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import { deleteRole } from 'actions/deals'
import { confirmation } from 'actions/confirmation'

import { getLegalFullName } from 'deals/utils/roles'

import IconButton from 'components/Button/IconButton'
import TrashIcon from 'components/SvgIcons/TrashIcon'
import Spinner from 'components/SvgIcons/CircleSpinner/IconCircleSpinner'
import Tooltip from 'components/tooltip'

DeleteRole.propTypes = {
  role: PropTypes.object.isRequired,
  deal: PropTypes.object.isRequired,
  tooltip: PropTypes.string,
  style: PropTypes.object,
  buttonStyle: PropTypes.object,
  iconProps: PropTypes.object,
  onDeleteRole: PropTypes.func
}

DeleteRole.defaultProps = {
  onDeleteRole: () => null,
  tooltip: 'Delete Role',
  style: {},
  buttonStyle: {},
  iconProps: {}
}

function DeleteRole(props) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleRemoveRole = useCallback(() => {
    props.confirmation({
      message: `Remove <b>${getLegalFullName(props.role)}</b>?`,
      confirmLabel: 'Yes, remove contact',
      onConfirm: async () => {
        try {
          setIsDeleting(true)
          await props.deleteRole(props.deal.id, props.role.id)
          props.onDeleteRole(props.role)

          props.notify({
            message: 'Contact removed',
            status: 'success'
          })
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
    <Tooltip caption={props.tooltip}>
      <IconButton
        appearance="icon"
        type="button"
        isFit
        onClick={handleRemoveRole}
        style={props.style}
        iconSize="large"
        {...props.buttonProps}
      >
        <TrashIcon {...props.iconProps} />
      </IconButton>
    </Tooltip>
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
