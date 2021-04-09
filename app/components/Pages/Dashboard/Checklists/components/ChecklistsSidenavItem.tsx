import { useState } from 'react'
import { useSelector } from 'react-redux'

import SideNavItem from 'components/PageSideNav/SideNavItem'
import { deletePropertyType } from 'models/property-types/delete-property-type'
import { selectUser } from 'selectors/user'
import { getActiveTeamId } from 'utils/user-teams'

import { getChecklistPageLink } from '../helpers/get-checklist-page-link'

interface Props {
  propertyType: IDealPropertyType
}

export function ChecklistsSidenavItem({ propertyType }: Props) {
  const [isDeleting, setIsDeleting] = useState(false)

  const user = useSelector(selectUser)

  if (isDeleting) {
    return null
  }

  const handleDelete = (id: UUID) => {
    try {
      setIsDeleting(true)
      deletePropertyType(getActiveTeamId(user)!, id)
    } catch (e) {
      console.log(e)
    }

    setIsDeleting(false)
  }

  return (
    <SideNavItem
      title={propertyType.label}
      link={getChecklistPageLink(propertyType.id)}
      onDelete={() => handleDelete(propertyType.id)}
    />
  )
}
