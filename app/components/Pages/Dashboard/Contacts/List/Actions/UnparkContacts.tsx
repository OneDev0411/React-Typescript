import React, { useState } from 'react'

import { mdiAccountArrowLeftOutline } from '@mdi/js'
import { useDispatch } from 'react-redux'

import { GridActionButton } from '@app/views/components/Grid/Table/features/Actions/Button'
import { addNotification as notify } from 'components/notification'
import { generateContactFilters } from 'models/contacts/bulk-tag/utils/generate-contact-filters'
import { unparkContact } from 'models/contacts/unparak-contact'

interface Props {
  contacts: UUID[]
  entireMode?: boolean
  excludedRows: UUID[]
  attributeFilters?: IContactAttributeFilter[]
  searchText?: string
  conditionOperator?: TContactFilterType
  users?: UUID[]
  crm_tasks?: UUID[]
  flows?: UUID[]
  disabled?: boolean
  callback(): void
}

export const UnparkContacts = ({
  contacts,
  callback,
  excludedRows,
  attributeFilters = [],
  searchText = '',
  conditionOperator,
  users = [],
  crm_tasks = [],
  flows = [],
  disabled = false
}: Props) => {
  const [isUnParking, setIsUnParking] = useState(false)
  const dispatch = useDispatch()

  const handleAddPending = async () => {
    setIsUnParking(true)

    try {
      const filter = generateContactFilters({
        excludes: excludedRows,
        attributes: attributeFilters,
        searchText,
        conditionOperator,
        users,
        crm_tasks,
        flows
      })

      await unparkContact(contacts, filter)
      callback()
      dispatch(
        notify({
          status: 'success',
          message: `${
            contacts.length || 'all'
          } parked contacts added to your contacts successfuly.`
        })
      )
    } catch (e) {
      console.error(e)
    } finally {
      setIsUnParking(false)
    }
  }

  return (
    <GridActionButton
      label={isUnParking ? 'Adding' : 'Add Contacts'}
      icon={mdiAccountArrowLeftOutline}
      disabled={isUnParking}
      onClick={handleAddPending}
    />
  )
}
