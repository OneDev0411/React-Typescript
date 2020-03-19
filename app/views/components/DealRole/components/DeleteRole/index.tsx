import React, { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { addNotification as notify } from 'reapop'

import {
  Tooltip,
  IconButton,
  IconButtonProps,
  makeStyles,
  Theme,
  createStyles
} from '@material-ui/core'

import { useIconStyles } from 'views/../styles/use-icon-styles'
import { deleteRole } from 'actions/deals'
import { confirmation } from 'actions/confirmation'

import { getLegalFullName } from 'deals/utils/roles'

import Spinner from 'components/LoadingContainer'
import TrashIcon from 'components/SvgIcons/Trash/TrashIcon'

interface Props {
  role: IDealRole
  deal: IDeal
  tooltip?: string
  buttonProps?: IconButtonProps
  onDeleteRole: (role: IDealRole) => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    removeButton: {
      '& svg path': {
        fill: theme.palette.common.black
      },
      '&:hover svg path': {
        fill: theme.palette.error.main
      }
    }
  })
)

export default function DeleteRole(props: Props) {
  const [isDeleting, setIsDeleting] = useState(false)
  const dispatch = useDispatch()
  const classes = useStyles()
  const iconClasses = useIconStyles()

  const handleRemoveRole = useCallback(() => {
    dispatch(
      confirmation({
        message: `Remove <b>${getLegalFullName(props.role)}</b>?`,
        confirmLabel: 'Yes, remove contact',
        onConfirm: async () => {
          try {
            setIsDeleting(true)
            await dispatch(deleteRole(props.deal.id, props.role.id))
            dispatch(props.onDeleteRole(props.role))

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
    <Tooltip title={props.tooltip}>
      <IconButton
        size="small"
        onClick={handleRemoveRole}
        className={classes.removeButton}
        {...props.buttonProps}
      >
        <TrashIcon className={iconClasses.small} />
      </IconButton>
    </Tooltip>
  )
}

DeleteRole.defaultProps = {
  onDeleteRole: () => null,
  tooltip: 'Delete Role',
  style: {},
  buttonStyle: {},
  iconProps: {}
}
