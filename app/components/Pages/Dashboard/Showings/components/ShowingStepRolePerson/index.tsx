import { memo, useEffect, useState } from 'react'
import { kebabCase } from 'lodash'

import {
  QuestionSection,
  QuestionSectionProps,
  QuestionTitle,
  useSectionContext,
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
  extends Pick<
      ShowingStepRolePersonSelectProps,
      'selectType' | 'isPrimaryAgent'
    >,
    Pick<QuestionSectionProps, 'error'> {
  personTitle: string
  person: Nullable<IShowingRoleInputPerson>
  onPersonChange: (person: Nullable<IShowingRoleInputPerson>) => void
  skippable?: boolean
  editable: boolean
  required?: boolean
}

function ShowingStepRolePerson({
  personTitle,
  person,
  onPersonChange,
  selectType,
  skippable = true,
  isPrimaryAgent,
  editable,
  required = false,
  error
}: ShowingStepRolePersonProps) {
  type Step = 'search' | 'edit' | 'card'

  const nextStep = useQuestionWizardSmartNext()
  const wizard = useWizardContext()
  const { step } = useSectionContext()

  const { setLoading } = useWizardContext()
  const [localStep, setLocalStep] = useState<Step>(editable ? 'search' : 'card')
  const [contact, setContact] = useState<Nullable<IContact>>(null)
  const { createContact, isCreatingContact } = useCreateContact()
  const { updateContact, isUpdatingContact } = useUpdateContact()

  useEffect(() => {
    if (step === wizard.currentStep && !editable) {
      nextStep(400)
    }
  }, [editable, nextStep, step, wizard.currentStep])

  const handleEdit = () => {
    setLocalStep('edit')
  }

  const handleRemove = () => {
    if (!required) {
      onPersonChange(null)
      setContact(null)
    }

    setLocalStep('search')
  }

  const handleSelect = (
    person: IShowingRoleInputPerson,
    contact?: IContact
  ) => {
    onPersonChange(person)
    setContact(contact ?? null)
    setLocalStep('edit')
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
    setLocalStep('card')
    nextStep(400)
  }

  function getSubmitLabel() {
    if (selectType === 'Contact') {
      return contact ? 'Save' : 'Save & Add to Contacts'
    }

    return step !== wizard.currentStep ? 'Save' : undefined
  }

  return (
    <QuestionSection error={error}>
      <QuestionTitle>
        Who is the listing {kebabCase(personTitle)}?
      </QuestionTitle>
      <SmartQuestionForm>
        {localStep === 'search' && (
          <ShowingStepRolePersonSelect
            selectType={selectType}
            onSelect={handleSelect}
            skippable={skippable}
            isPrimaryAgent={isPrimaryAgent}
          />
        )}
        {localStep === 'edit' && person && (
          <ShowingStepRolePersonEditForm
            personTitle={personTitle}
            initialData={person}
            onSubmit={handleSubmit}
            onCancel={handleRemove}
            submitLabel={getSubmitLabel()}
            submitDisabled={isCreatingContact || isUpdatingContact}
          />
        )}
        {localStep === 'card' && person && (
          <ShowingStepRolePersonCard
            person={person}
            personTitle={personTitle}
            onEdit={handleEdit}
            onRemove={handleRemove}
            editable={editable}
          />
        )}
      </SmartQuestionForm>
    </QuestionSection>
  )
}

export default memo(ShowingStepRolePerson)
