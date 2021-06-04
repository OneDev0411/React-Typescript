import AutocompleteField, {
  BaseOption,
  AutocompleteFieldProps
} from 'components/AutocompleteField'

import { searchContacts } from 'models/contacts/search-contacts'

type AgentOption = BaseOption & IContact

export interface ContactAutocompleteFieldProps
  extends Omit<
    AutocompleteFieldProps<AgentOption>,
    'options' | 'noOptionsText'
  > {
  searchFieldValue: keyof IContact
  searchFieldLabel: keyof IContact
}

function ContactAutocompleteField({
  searchFieldValue,
  searchFieldLabel,
  ...otherProps
}: ContactAutocompleteFieldProps) {
  const getOptions = async (value: string) => {
    const { data: contacts } = await searchContacts(value)

    return contacts
      .filter(contact => !!contact[searchFieldValue])
      .map((contact: IContact) => ({
        ...contact,
        value: (contact[searchFieldValue] || '') as string,
        label: (contact[searchFieldLabel] || '') as string
      }))
  }

  return (
    <AutocompleteField
      {...otherProps}
      options={getOptions}
      noOptionsText={loading =>
        loading ? 'Searching your contacts' : 'Type to search your contacts'
      }
    />
  )
}

export default ContactAutocompleteField
