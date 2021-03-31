import React, { useState } from 'react'
import { kebabCase } from 'lodash'

import {
  QuestionForm,
  QuestionSection,
  QuestionTitle,
  useWizardContext
} from 'components/QuestionWizard'

import { ShowingRolePerson } from '../../types'
import ShowingStepRolePersonSelectAgent from './ShowingStepRolePersonSelectAgent'
import ShowingStepRolePersonEditForm from './ShowingStepRolePersonEditForm'
import ShowingStepRolePersonSelectContact from './ShowingStepRolePersonSelectContact'
import ShowingStepRolePersonCard from './ShowingStepRolePersonCard'

export type RolePersonSelectType = 'Agent' | 'Contact'

interface ShowingStepRolePersonProps {
  hidden: boolean
  roleType: IShowingRoleType
  person: Nullable<ShowingRolePerson>
  onPersonChange: (person: ShowingRolePerson) => void
  selectType?: RolePersonSelectType
}

function ShowingStepRolePerson({
  hidden,
  roleType,
  person,
  onPersonChange,
  selectType = 'Agent'
}: ShowingStepRolePersonProps) {
  const wizard = useWizardContext()
  const [isEditable, setIsEditable] = useState(true)

  const handleSubmit = (person: ShowingRolePerson) => {
    onPersonChange(person)
    setIsEditable(false)
    wizard.next()
  }

  return (
    <QuestionSection hidden={hidden}>
      <QuestionTitle>Who is the listing {kebabCase(roleType)}?</QuestionTitle>
      <QuestionForm>
        {!person && selectType === 'Agent' && (
          <ShowingStepRolePersonSelectAgent onSelect={onPersonChange} />
        )}
        {!person && selectType === 'Contact' && (
          <ShowingStepRolePersonSelectContact onSelect={onPersonChange} />
        )}
        {person && isEditable && (
          <ShowingStepRolePersonEditForm
            initialData={person}
            onSubmit={handleSubmit}
          />
        )}
        {person && !isEditable && <ShowingStepRolePersonCard person={person} />}
      </QuestionForm>
    </QuestionSection>
  )
}

export default ShowingStepRolePerson
