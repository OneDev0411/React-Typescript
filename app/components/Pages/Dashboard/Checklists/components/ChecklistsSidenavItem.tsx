import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import SideNavItem from 'components/PageSideNav/SideNavItem'
import { deletePropertyType } from 'models/property-types/delete-property-type'
import { selectUser } from 'selectors/user'
import { getActiveTeamId } from 'utils/user-teams'
import { addNotification as notify } from 'components/notification'

import { confirmation } from 'actions/confirmation'

import { getChecklistPageLink } from '../helpers/get-checklist-page-link'

interface Props {
  propertyType: IDealPropertyType
}

export function ChecklistsSidenavItem({ propertyType }: Props) {
  const [isDeleted, setIsDeleted] = useState(false)

  const user = useSelector(selectUser)
  const dispatch = useDispatch()

  const requestDelete = (propertyType: IDealPropertyType) => {
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
      await deletePropertyType(getActiveTeamId(user)!, id)

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
    <SideNavItem
      title={propertyType.label}
      link={getChecklistPageLink(propertyType.id, 'Offer')}
      onDelete={() => requestDelete(propertyType)}
    />
  )
}
