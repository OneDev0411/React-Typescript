import React, { memo, useState } from 'react'
import { kebabCase } from 'lodash'

import {
  QuestionForm,
  QuestionSection,
  QuestionTitle
} from 'components/QuestionWizard'

import ShowingStepRolePersonEditForm from './ShowingStepRolePersonEditForm'
import ShowingStepRolePersonCard from './ShowingStepRolePersonCard'
import ShowingStepRolePersonSelect, {
  ShowingStepRolePersonSelectProps
} from './ShowingStepRolePersonSelect'
import useQuestionWizardSmartNext from '../use-question-wizard-smart-next'

interface ShowingStepRolePersonProps
  extends Pick<ShowingStepRolePersonSelectProps, 'selectType'> {
  roleType: IShowingRoleType
  person: Nullable<IShowingRolePerson>
  onPersonChange: (person: Nullable<IShowingRolePerson>) => void
}

function ShowingStepRolePerson({
  roleType,
  person,
  onPersonChange,
  selectType
}: ShowingStepRolePersonProps) {
  const nextStep = useQuestionWizardSmartNext()
  const [isEditable, setIsEditable] = useState(true)

  const handleSubmit = (person: IShowingRolePerson) => {
    onPersonChange(person)
    setIsEditable(false)
    nextStep()
  }

  const handleEdit = () => {
    setIsEditable(true)
  }

  const handleRemove = () => {
    onPersonChange(null)
    setIsEditable(true)
  }

  return (
    <QuestionSection>
      <QuestionTitle>Who is the listing {kebabCase(roleType)}?</QuestionTitle>
      <QuestionForm>
        {!person && (
          <ShowingStepRolePersonSelect
            selectType={selectType}
            onSelect={onPersonChange}
          />
        )}
        {person && isEditable && (
          <ShowingStepRolePersonEditForm
            roleType={roleType}
            initialData={person}
            onSubmit={handleSubmit}
          />
        )}
        {person && !isEditable && (
          <ShowingStepRolePersonCard
            person={person}
            roleType={roleType}
            onEdit={handleEdit}
            onRemove={handleRemove}
          />
        )}
      </QuestionForm>
    </QuestionSection>
  )
}

export default memo(ShowingStepRolePerson)
