import React, { memo, useState } from 'react'
import { kebabCase } from 'lodash'

import {
  QuestionSection,
  QuestionTitle,
  useWizardContext
} from 'components/QuestionWizard'

import ShowingStepRolePersonEditForm from './ShowingStepRolePersonEditForm'
import ShowingStepRolePersonCard from './ShowingStepRolePersonCard'
import ShowingStepRolePersonSelect, {
  ShowingStepRolePersonSelectProps
} from './ShowingStepRolePersonSelect'
import useQuestionWizardSmartNext from '../../hooks/use-question-wizard-smart-next'
import SmartQuestionForm from '../SmartQuestionForm'
import useCreateContact from './use-create-contact'
import useUpdateContact from './use-update-contact'

interface ShowingStepRolePersonProps
  extends Pick<ShowingStepRolePersonSelectProps, 'selectType'> {
  personTitle: string
  person: Nullable<IShowingRoleInputPerson>
  onPersonChange: (person: Nullable<IShowingRoleInputPerson>) => void
  skippable?: boolean
}

function ShowingStepRolePerson({
  personTitle,
  person,
  onPersonChange,
  selectType,
  skippable = true
}: ShowingStepRolePersonProps) {
  const nextStep = useQuestionWizardSmartNext()
  const { setLoading } = useWizardContext()
  const [isEditable, setIsEditable] = useState(true)
  const [contact, setContact] = useState<Nullable<IContact>>(null)
  const { createContact, isCreatingContact } = useCreateContact()
  const { updateContact, isUpdatingContact } = useUpdateContact()

  const handleEdit = () => {
    setIsEditable(true)
  }

  const handleRemove = () => {
    onPersonChange(null)
    setIsEditable(true)
    setContact(null)
  }

  const handleSelect = (
    person: IShowingRoleInputPerson,
    contact?: IContact
  ) => {
    onPersonChange(person)
    setContact(contact ?? null)
  }

  const handleSubmit = async (person: IShowingRoleInputPerson) => {
    if (selectType === 'Contact') {
      setLoading(true)

      if (!contact) {
        setContact(await createContact(person))
      } else {
        setContact(await updateContact(contact, person))
      }

      setLoading(false)
    }

    onPersonChange(person)
    setIsEditable(false)
    nextStep(400)
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
            onSelect={handleSelect}
            skippable={skippable}
          />
        )}
        {person && isEditable && (
          <ShowingStepRolePersonEditForm
            personTitle={personTitle}
            initialData={person}
            onSubmit={handleSubmit}
            onCancel={handleRemove}
            submitLabel={
              selectType === 'Contact'
                ? contact
                  ? 'Save'
                  : 'Save & Add to Contacts'
                : undefined
            }
            submitDisabled={isCreatingContact || isUpdatingContact}
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
