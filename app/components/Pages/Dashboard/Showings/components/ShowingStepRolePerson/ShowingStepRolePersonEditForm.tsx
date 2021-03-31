import React from 'react'

import { ShowingRolePerson } from '../../types'

interface ShowingStepRolePersonEditFormProps {
  initialData: ShowingRolePerson
  onSubmit: (data: ShowingRolePerson) => void
}

function ShowingStepRolePersonEditForm({
  initialData,
  onSubmit
}: ShowingStepRolePersonEditFormProps) {
  return (
    <div>
      ShowingStepRolePersonEditForm
      <button type="button" onClick={onSubmit as any}>
        next
      </button>
    </div>
  )
}

export default ShowingStepRolePersonEditForm
