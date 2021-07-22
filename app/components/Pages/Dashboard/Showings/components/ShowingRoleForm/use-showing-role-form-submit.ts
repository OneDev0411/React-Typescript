import { FormApi } from 'final-form'

import { CreateContactInput, ShowingRoleFormValues } from './types'
import useCreateContact from './use-create-contact'
import useUpdateContact from './use-update-contact'

interface UseShowingRoleFormSubmit {
  handleSubmit: (
    values: ShowingRoleFormValues,
    form: FormApi<ShowingRoleFormValues>
  ) => Promise<void>
  isSavingContact: boolean
}

function useShowingRoleFormSubmit(
  onChange: (values: ShowingRoleFormValues) => void
): UseShowingRoleFormSubmit {
  const { isUpdatingContact, updateContact } = useUpdateContact()
  const { isCreatingContact, createContact } = useCreateContact()

  const handleSubmit = async (
    values: ShowingRoleFormValues,
    form: FormApi<ShowingRoleFormValues>
  ) => {
    if (values.role !== 'Tenant' || !values.save_to_contact) {
      onChange(values)

      return
    }

    const contactInfo: CreateContactInput = {
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      phone_number: values.phone_number
    }

    const contact = values.contact
      ? await updateContact(values.contact, contactInfo)
      : await createContact(contactInfo)

    form.mutators.selectContact(contact)

    onChange({ ...values, contact })
  }

  return {
    handleSubmit,
    isSavingContact: isUpdatingContact || isCreatingContact
  }
}

export default useShowingRoleFormSubmit
