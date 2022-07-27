import { useState } from 'react'

import { Button } from '@material-ui/core'

import useNotify from '@app/hooks/use-notify'
import { addBrandChecklist } from '@app/models/BrandConsole/Checklists'

import { TabNames } from '../constants'

interface Props {
  brandId: UUID
  propertyTypeId: UUID
  checklistType: 'Buying' | 'Selling' | 'Offer'
  onCreateChecklist: (checklist: IBrandChecklist) => void
}

export function ChecklistCreate({
  brandId,
  propertyTypeId,
  checklistType,
  onCreateChecklist
}: Props) {
  const [isCreating, setIsCreating] = useState(false)
  const notify = useNotify()

  const createChecklist = async () => {
    setIsCreating(true)

    let tabName = ''

    if (checklistType === 'Selling') {
      tabName = 'Listing Inbox'
    }

    if (['Buying', 'Offer'].includes(checklistType)) {
      tabName = 'Contract Inbox'
    }

    try {
      const checklist = await addBrandChecklist(brandId, {
        brand: brandId,
        title: checklistType,
        tab_name: tabName,
        checklist_type: checklistType,
        property_type: propertyTypeId,
        is_terminatable: false,
        is_deactivatable: false,
        order: 1
      })

      onCreateChecklist(checklist)
    } catch (e) {
      console.log(e)
      notify({
        status: 'error',
        message: 'No checklist could be created'
      })
    }

    setIsCreating(false)
  }

  const checklistName = TabNames.find(tab => tab.type === checklistType)?.title

  return (
    <Button
      variant="contained"
      color="secondary"
      disabled={isCreating}
      onClick={createChecklist}
    >
      Create {checklistName} Checklist
    </Button>
  )
}
