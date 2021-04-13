import React, { memo, useState } from 'react'
import { kebabCase } from 'lodash'

import { QuestionSection, QuestionTitle } from 'components/QuestionWizard'

import ShowingStepRolePersonEditForm from './ShowingStepRolePersonEditForm'
import ShowingStepRolePersonCard from './ShowingStepRolePersonCard'
import ShowingStepRolePersonSelect, {
  ShowingStepRolePersonSelectProps
} from './ShowingStepRolePersonSelect'
import useQuestionWizardSmartNext from '../use-question-wizard-smart-next'
import SmartQuestionForm from '../SmartQuestionForm'

interface ShowingStepRolePersonProps
  extends Pick<ShowingStepRolePersonSelectProps, 'selectType'> {
  roleType: IDealRoleType
  personTitle: string
  person: Nullable<IShowingRoleInputPerson>
  onPersonChange: (person: Nullable<IShowingRoleInputPerson>) => void
  skippable?: boolean
}

function ShowingStepRolePerson({
  roleType,
  personTitle,
  person,
  onPersonChange,
  selectType,
  skippable = true
}: ShowingStepRolePersonProps) {
  const nextStep = useQuestionWizardSmartNext()
  const [isEditable, setIsEditable] = useState(true)

  const handleSubmit = (person: IShowingRoleInputPerson) => {
    onPersonChange(person)
    setIsEditable(false)
    nextStep(400)
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
      <QuestionTitle>
        Who is the listing {kebabCase(personTitle)}?
      </QuestionTitle>
      <SmartQuestionForm>
        {!person && (
          <ShowingStepRolePersonSelect
            selectType={selectType}
            onSelect={onPersonChange}
            skippable={skippable}
          />
        )}
        {person && isEditable && (
          <ShowingStepRolePersonEditForm
            roleType={roleType}
            personTitle={personTitle}
            initialData={person}
            onSubmit={handleSubmit}
          />
        )}
        {person && !isEditable && (
          <ShowingStepRolePersonCard
            person={person}
            personTitle={personTitle}
            onEdit={handleEdit}
            onRemove={handleRemove}
          />
        )}
      </SmartQuestionForm>
    </QuestionSection>
  )
}

export default memo(ShowingStepRolePerson)
