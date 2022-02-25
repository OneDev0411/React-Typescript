import { useState } from 'react'

import {
  Box,
  IconButton,
  makeStyles,
  Theme,
  Typography
} from '@material-ui/core'
import { mdiDrag, mdiTrashCan } from '@mdi/js'
import cn from 'classnames'
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot
} from 'react-beautiful-dnd'
import { useDispatch } from 'react-redux'
import { browserHistory, Link } from 'react-router'

import { useActiveBrandId } from '@app/hooks/brand/use-active-brand-id'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'
import { confirmation } from 'actions/confirmation'
import { addNotification as notify } from 'components/notification'
import { deletePropertyType } from 'models/property-types/delete-property-type'

import { getChecklistPageLink } from '../helpers/get-checklist-page-link'

import { PropertyTypeEdit } from './PropertyTypeEdit'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing(0.5, 1.5),
      width: '100%',
      borderRadius: `${theme.shape.borderRadius}px 0 0 ${theme.shape.borderRadius}px`,
      '&:hover': {
        backgroundColor: theme.palette.action.hover
      },
      '&:hover .icon-button': {
        visibility: 'visible'
      },
      '&.active': {
        backgroundColor: theme.palette.info.light
      }
    },
    dragHandler: {
      display: 'flex',
      alignItems: 'center',
      marginRight: theme.spacing(0.5),
      color: theme.palette.grey['500']
    },
    link: {
      color: '#000',
      '&:hover': {
        color: theme.palette.info.main
      }
    },
    deleteIcon: {
      color: theme.palette.error.main,
      visibility: 'hidden'
    }
  }),
  {
    name: 'ChecklistSideNavItem'
  }
)

interface Props {
  index: number
  isSelected: boolean
  checklistType: IDealChecklistType
  propertyType: IDealPropertyType
  onUpdate: (propertyType: IDealPropertyType) => void
}

export function ChecklistsSidenavItem({
  index,
  isSelected,
  checklistType,
  propertyType,
  onUpdate
}: Props) {
  const classes = useStyles()
  const [isDeleted, setIsDeleted] = useState(false)
  const activeBrandId = useActiveBrandId()
  const dispatch = useDispatch()

  const requestDelete = (propertyType: IDealPropertyType) => {
    if (propertyType.brand !== activeBrandId) {
      dispatch(
        confirmation({
          description: `You can not delete this property type because 
          it doesn’t belong to your team`,
          confirmLabel: 'Okay',
          hideCancelButton: true
        })
      )

      return
    }

    dispatch(
      confirmation({
        message: `Delete ${propertyType.label}?`,
        description:
          'This action will remove the property and all related checklists',
        confirmLabel: 'Yes, Delete',
        onConfirm: () => handleDelete(propertyType.id)
      })
    )
  }

  const handleDelete = async (id: UUID) => {
    try {
      setIsDeleted(true)
      await deletePropertyType(activeBrandId, id)

      browserHistory.push('/dashboard/checklists')

      dispatch(
        notify({
          status: 'success',
          message: 'Property deleted'
        })
      )
    } catch (e) {
      console.log(e)
      setIsDeleted(false)

      dispatch(
        notify({
          status: 'success',
          message: 'Could not delete the property'
        })
      )
    }
  }

  if (isDeleted) {
    return null
  }

  return (
    <Draggable draggableId={propertyType.id} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <div ref={provided.innerRef} {...provided.draggableProps}>
          <div
            className={cn(classes.root, {
              active: isSelected
            })}
          >
            <Box display="flex" alignItems="center">
              <div
                {...provided.dragHandleProps}
                className={classes.dragHandler}
              >
                <SvgIcon path={mdiDrag} />
              </div>

              <Link
                to={getChecklistPageLink(propertyType.id, checklistType)}
                className={classes.link}
              >
                <Typography variant="body2">{propertyType.label}</Typography>
              </Link>
            </Box>

            <div>
              <PropertyTypeEdit
                propertyType={propertyType}
                onUpdate={onUpdate}
              />

              <IconButton
                size="small"
                onClick={() => requestDelete(propertyType)}
              >
                <SvgIcon
                  path={mdiTrashCan}
                  className={cn(classes.deleteIcon, 'icon-button')}
                  size={muiIconSizes.small}
                />
              </IconButton>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  )
}
