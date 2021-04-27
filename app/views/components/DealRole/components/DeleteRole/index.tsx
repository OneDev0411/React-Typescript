import React, { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { Tooltip, IconButton, IconButtonProps } from '@material-ui/core'
import { mdiTrashCanOutline } from '@mdi/js'

import { addNotification as notify } from 'components/notification'

import { deleteRole } from 'actions/deals'
import { confirmation } from 'actions/confirmation'

import { getLegalFullName } from 'deals/utils/roles'

import Spinner from 'components/LoadingContainer'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

interface Props {
  role: IDealRole
  deal: IDeal
  tooltip?: string
  buttonProps?: IconButtonProps
  onDeleteRole: (role: IDealRole) => void
}

export default function DeleteRole(props: Props) {
  const [isDeleting, setIsDeleting] = useState(false)
  const dispatch = useDispatch()

  const handleRemoveRole = useCallback(() => {
    dispatch(
      confirmation({
        message: `Remove <b>${getLegalFullName(props.role)}</b>?`,
        confirmLabel: 'Yes, remove contact',
        onConfirm: async () => {
          try {
            setIsDeleting(true)
            await dispatch(deleteRole(props.deal.id, props.role.id))
            props.onDeleteRole(props.role)

            dispatch(
              notify({
                message: 'Contact removed',
                status: 'success'
              })
            )
          } catch (e) {
            dispatch(
              notify({
                message:
                  'Can not remove the contact from this deal, please try again',
                status: 'error'
              })
            )
          } finally {
            setIsDeleting(false)
          }
        }
      })
    )
  }, [dispatch, props])

  if (isDeleting) {
    return <Spinner style={{ padding: 0 }} size="1.5rem" />
  }

  return (
    <Tooltip title={props.tooltip || ''}>
      <IconButton
        size="small"
        onClick={handleRemoveRole}
        {...props.buttonProps}
      >
        <SvgIcon path={mdiTrashCanOutline} size={muiIconSizes.small} />
      </IconButton>
    </Tooltip>
  )
}
